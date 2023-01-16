import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';

import { SetupStep, setupSteps } from '../../../app/shared';
import { ElectronService } from '../core/services';
import { BaseComponent } from '../shared';

@Component({
	selector: 'app-setup',
	templateUrl: './setup.component.html',
	styleUrls: ['./setup.component.scss'],
})
export class SetupComponent extends BaseComponent implements OnInit {
	readonly steps = setupSteps;

	currentStepIndex = -1;
	currentStep: SetupStep = {
		key: 'loading',
		label: 'Loading',
	};

	progress?: number = undefined;

	constructor(
		private electron: ElectronService,
		private cdr: ChangeDetectorRef,
		private router: Router,
	) {
		super();
	}

	ngOnInit() {
		this.electron
			.on('download-progress')
			.pipe(takeUntil(this.ngDestroyed$))
			.subscribe(({ progress }) => {
				if (progress === 100) {
					progress = undefined;
				}

				this.progress = progress;
				this.cdr.detectChanges();
			});

		this.electron
			.on('setup-progress')
			.pipe(takeUntil(this.ngDestroyed$))
			.subscribe(({ index, error, complete }) => {
				if (error) {
					alert(error.message);
					return;
				}

				if (complete) {
					this.router.navigate(['/game']);
					return;
				}

				// Reset the progress
				this.progress = undefined;

				// Update the current step
				this.updateStep(index);
			});

		this.electron.send('begin-setup');
	}

	private updateStep(index: number) {
		this.currentStepIndex = index;
		this.currentStep = setupSteps[index];
		this.cdr.detectChanges();
	}
}
