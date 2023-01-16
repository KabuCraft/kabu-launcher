import { IpcMainEvent, ipcMain } from 'electron';

import { setupSteps } from '../../src/shared';
import { setupConfig } from './setup.config';

export const runSetup = async (event?: IpcMainEvent) => {
	for (let i = 0; i < setupSteps.length; i++) {
		const step = setupSteps[i];
		const config = setupConfig[step.key];

		if (event) {
			event.sender.send('setup-progress', { index: i });
		}
		console.log(`Running step ${i + 1} - ${step.key}`);

		try {
			await config.run(event);
		} catch (e) {
			console.error(e);

			if (event) {
				event.sender.send('setup-progress', { error: e });
			}
			break;
		}
	}
};
