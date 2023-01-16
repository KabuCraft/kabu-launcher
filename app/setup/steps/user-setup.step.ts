import path from 'path';
import fs from 'fs';
import { createHash } from 'crypto';

import { SetupStepConfig } from '../types';
import { LAUNCHER_DIR } from '../const';
import { requestData } from '../../util';
import { UserDataEvents, UserDataResponse } from '../../shared';

const LAUNCHER_ACCOUNTS_FILE_NAME = 'accounts.json';

export const userSetupStep: SetupStepConfig = {
	run: async (event) => {
		// Edit launcher config
		const accountsPath = path.join(LAUNCHER_DIR, LAUNCHER_ACCOUNTS_FILE_NAME);
		if (fs.existsSync(accountsPath)) {
			return;
		}

		const userData = await requestData<UserDataResponse>(
			UserDataEvents.REQUEST_ID,
			UserDataEvents.REPLY_ID,
			event,
		);

		const username = userData.username;

		console.log(createHash('md5').update(username).digest());
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

		await fs.promises.writeFile(
			accountsPath,
			JSON.stringify(accountData, null, 2),
		);
	},
};
