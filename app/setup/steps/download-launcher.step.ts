import fs from 'fs';
import path from 'path';

import { SetupStepConfig } from '../types';
import { DATA_DIR, LAUNCHER_DIR, LAUNCHER_URL } from '../const';
import { downloadFile, extract } from '../../util';

export const downloadLauncherStep: SetupStepConfig = {
	run: async (event) => {
		if (fs.existsSync(LAUNCHER_DIR)) {
			return;
		}

		if (!fs.existsSync(DATA_DIR)) {
			await fs.promises.mkdir(DATA_DIR);
		}

		const fileName = 'mmc.zip';
		const zipDir = path.join(DATA_DIR, fileName);
		await downloadFile(LAUNCHER_URL, zipDir, event);
		await extract(zipDir, LAUNCHER_DIR, true, true);
	},
};
