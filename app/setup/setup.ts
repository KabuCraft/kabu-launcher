import { ipcMain } from 'electron';

import { SetupStep, setupSteps } from '../../src/shared';
import {
	downloadJDKStep,
	downloadLauncherStep,
	downloadModpackStep,
} from './steps';
import { SetupStepConfig } from './types';

const setupActions: { [key in SetupStep['key']]: SetupStepConfig } = {
	'download-jdk': downloadJDKStep,
	'download-launcher': downloadLauncherStep,
	'download-modpack': downloadModpackStep,
};

ipcMain.on('begin-setup', async (event) => {
	for (let i = 0; i < setupSteps.length; i++) {
		event.sender.send('setup-progress', { index: i });

		const step = setupSteps[i];
		const config = setupActions[step.key];

		try {
			await config.run();
		} catch (e) {
			console.error(e);
			event.sender.send('setup-progress', { error: e });
			break;
		}
	}
});
