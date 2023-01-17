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
	/**
	 * The setup steps.
	 */
	readonly steps = setupSteps;

	/**
	 * Index of the current step.
	 */
	currentStepIndex = -1;

	/**
	 * The current step.
	 */
	currentStep: SetupStep = {
		key: 'loading',
		label: 'Loading',
	};

	/**
	 * Progress of the current step.
	 */
	progress?: number = undefined;

	constructor(
		private electron: ElectronService,
		private cdr: ChangeDetectorRef,
		private router: Router,
	) {
		super();
	}

	ngOnInit() {
		// Listen to download progress updates
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

		// Listen to step changes
		this.electron
			.on('setup-progress')
			.pipe(takeUntil(this.ngDestroyed$))
			.subscribe(({ index, error, complete }) => {
				if (error) {
					alert(error.message);
					return;
				}

				// Once the setup is complete, launch the game
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

	/**
	 * Update the current step by index.
	 *
	 * @param index
	 * @private
	 */
	private updateStep(index: number) {
		this.currentStepIndex = index;
		this.currentStep = setupSteps[index];
		this.cdr.detectChanges();
	}
}
