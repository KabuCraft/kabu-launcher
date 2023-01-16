import { IpcMainEvent } from 'electron';
import { error, log } from 'electron-log';

import { setupSteps } from '../shared';
import { setupConfig } from './setup.config';

export const runSetup = async (event?: IpcMainEvent) => {
	for (let i = 0; i < setupSteps.length; i++) {
		const step = setupSteps[i];
		const config = setupConfig[step.key];

		if (event) {
			event.sender.send('setup-progress', { index: i });
		}
		log(`Running step ${i + 1} - ${step.key}`);

		try {
			await config.run(event);
		} catch (e) {
			error(e);

			if (event) {
				event.sender.send('setup-progress', { error: e });
			}
			return;
		}

		log(`Finished step ${i + 1}`);
	}

	event.sender.send('setup-progress', { complete: true });
};
