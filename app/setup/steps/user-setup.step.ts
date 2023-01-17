import path from 'path';
import fs from 'fs';
import { createHash } from 'crypto';
import { log } from 'electron-log';

import { SetupStepConfig } from '../types';
import { LAUNCHER_DIR } from '../const';
import { requestData } from '../../util';
import { UserDataEvents, UserDataResponse } from '../../shared';

const LAUNCHER_ACCOUNTS_FILE_NAME = 'accounts.json';

/**
 * This step sets up user data in the launcher.
 */
export const userSetupStep: SetupStepConfig = {
	run: async (event) => {
		// Edit launcher config
		const accountsPath = path.join(LAUNCHER_DIR, LAUNCHER_ACCOUNTS_FILE_NAME);
		if (fs.existsSync(accountsPath)) {
			log('User data exists. Skipping');
			return;
		}

		// Request user data from the frontend
		log('Requesting user data from the frontend');
		const userData = await requestData<UserDataResponse>(
			UserDataEvents.REQUEST_ID,
			UserDataEvents.REPLY_ID,
			event,
		);

		const username = userData.username;

		// Create the account data object
		// This is made with dummy data since we don't have integration with Microsoft
		const accountData: any = {
			accounts: [
				{
					active: true,
					type: 'dummy',
					ygg: {
						extra: {
							clientToken: createHash('md5').update(username).digest('hex'),
							userName: username,
						},
						iat: +new Date(),
						token: username,
					},
				},
			],
			formatVersion: 3,
		};

		// Create the account data file
		log('Creating account data file');
		await fs.promises.writeFile(
			accountsPath,
			JSON.stringify(accountData, null, 2),
		);
	},
};
