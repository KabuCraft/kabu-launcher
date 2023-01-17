import { ipcMain, IpcMainEvent } from 'electron';
import { error, log } from 'electron-log';

import { setupSteps } from '../shared';
import { setupConfig } from './setup.config';

/**
 * Starts the game setup.
 * @param event
 */
export const runSetup = async (event?: IpcMainEvent) => {
	for (let i = 0; i < setupSteps.length; i++) {
		const step = setupSteps[i];
		const config = setupConfig[step.key];

		// Notify the sender of the current step
		event?.sender?.send?.('setup-progress', { index: i });
		log(`Running step ${i + 1} - ${step.key}`);

		try {
			await config.run(event);
		} catch (e) {
			error(e);
			event?.sender?.send?.('setup-progress', { error: e });
			return;
		}

		log(`Finished step ${i + 1}`);
	}

	// Notify the sender that the setup is complete
	event.sender.send('setup-progress', { complete: true });
};

ipcMain?.on('begin-setup', (event) => runSetup(event));
