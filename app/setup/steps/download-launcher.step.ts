import fs from 'fs';
import path from 'path';
import { log } from 'electron-log';

import { SetupStepConfig } from '../types';
import { DATA_DIR, LAUNCHER_DIR, LAUNCHER_URL } from '../const';
import { downloadFile, extract } from '../../util';

/**
 * This step downloads and extracts the backend launcher.
 */
export const downloadLauncherStep: SetupStepConfig = {
	run: async (event) => {
		// Do nothing if the directory already exists
		if (fs.existsSync(LAUNCHER_DIR)) {
			log('Launcher exists. Skipping');
			return;
		}

		// Download and extract
		log('Downloading and extracting launcher');
		const fileName = 'mmc.zip';
		const zipDir = path.join(DATA_DIR, fileName);
		await downloadFile(LAUNCHER_URL, zipDir, event);
		await extract(zipDir, LAUNCHER_DIR, true, true);
	},
};
