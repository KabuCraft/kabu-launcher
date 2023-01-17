import { ipcMain, IpcMainEvent } from 'electron';
import { error, log } from 'electron-log';

import { setupSteps, SetupUpdate } from '../shared';
import { setupConfig } from './setup.config';

/**
 * Sends an update to the frontend.
 *
 * @param update
 * @param event
 */
const sendUpdate = (update: SetupUpdate, event?: IpcMainEvent) =>
	event?.sender?.send?.('setup-progress', update);

/**
 * Starts the game setup.
 * @param event
 */
export const runSetup = async (event?: IpcMainEvent) => {
	for (let i = 0; i < setupSteps.length; i++) {
		const step = setupSteps[i];
		const config = setupConfig[step.key];

		// Notify the sender of the current step
		sendUpdate({ key: step.key }, event);
		log(`Running step ${i + 1} - ${step.key}`);

		try {
			await config.run(event);
		} catch (e) {
			error(e);
			sendUpdate({
				key: step.key,
				error: e,
			});
			return;
		}

		log(`Finished step ${i + 1}`);
	}

	// Notify the sender that the setup is complete
	sendUpdate({ complete: true }, event);
};

ipcMain?.on('begin-setup', (event) => runSetup(event));
