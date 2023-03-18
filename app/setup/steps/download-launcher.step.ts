import fs from 'fs';
import path from 'path';
import { log } from 'electron-log';

import { SetupStepConfig } from '../types';
import { DATA_DIR, LAUNCHER_DIR, LAUNCHER_EXECUTABLE } from '../const';
import { downloadFile, extract } from '../../util';

/**
 * The URL to download the launcher from.
 */
export let LAUNCHER_URL =
	process.env['LAUNCHER_URL'] ||
	'https://nightly.link/UltimMC/Launcher/workflows/main/develop/mmc-cracked-win32.zip';
if (process.platform === 'linux') {
	LAUNCHER_URL = LAUNCHER_URL.replace('win32', 'lin64');
	if (LAUNCHER_URL.includes('.multimc.')) {
		LAUNCHER_URL = LAUNCHER_URL.replace('.zip', '.tar.gz');
	}
} else {
	LAUNCHER_URL = LAUNCHER_URL.replace('lin64', 'win32').replace(
		'.tar.gz',
		'.zip',
	);
}

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
		await extract(zipDir, LAUNCHER_DIR, true);

		// Give write permission to the file
		if (process.platform === 'linux') {
			await fs.promises.chmod(LAUNCHER_EXECUTABLE, 0o755);
		}
	},
};
