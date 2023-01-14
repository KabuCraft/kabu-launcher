import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SetupStep, setupSteps } from '../../shared';
import { ElectronService } from '../core/services';

@Component({
	selector: 'app-setup',
	templateUrl: './setup.component.html',
	styleUrls: ['./setup.component.scss'],
})
export class SetupComponent implements OnInit {
	readonly steps = setupSteps;

	currentStepIndex = -1;
	currentStep: SetupStep = {
		key: 'loading',
		label: 'Loading',
	};

	constructor(
		private electron: ElectronService,
		private cdr: ChangeDetectorRef,
	) {}

	ngOnInit() {
		this.electron.ipcRenderer.on(
			'setup-progress',
			(_event, { index, error }) => {
				if (error) {
					alert(error.message);
					return;
				}

				this.updateStep(index);
			},
		);
		this.electron.ipcRenderer.send('begin-setup');
	}

	private updateStep(index: number) {
		console.log(index);
		this.currentStepIndex = index;
		this.currentStep = setupSteps[index];
		console.log(this.currentStep);
		this.cdr.detectChanges();
	}
}
