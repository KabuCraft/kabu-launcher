import fs from 'fs';
import path from 'path';
import { log } from 'electron-log';

import { SetupStepConfig } from '../types';
import { DATA_DIR, JDK_DIR } from '../const';
import { downloadFile, extension, extract } from '../../util';

let JDK_URL: string;
if (process.platform === 'win32') {
	JDK_URL =
		'https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_windows-x64_bin.zip';
} else {
	JDK_URL =
		'https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_linux-x64_bin.tar.gz';
}

/**
 * This step downloads and extracts the appropriate Java for the launcher.
 */
export const downloadJDKStep: SetupStepConfig = {
	run: async (event) => {
		// Do nothing if the directory already exists
		if (fs.existsSync(JDK_DIR)) {
			log('Java directory exists. Skipping');
			return;
		}

		// Create the data directory if it doesn't exist
		if (!fs.existsSync(DATA_DIR)) {
			log('Creating data directory');
			await fs.promises.mkdir(DATA_DIR);
		}

		// Download and extract
		log('Downloading and extracting Java');
		const fileName = 'jdk.' + extension(JDK_URL);
		const targetDir = path.dirname(JDK_DIR);
		const zipDir = path.join(targetDir, fileName);
		await downloadFile(JDK_URL, zipDir, event);
		await extract(zipDir, JDK_DIR, true);
	},
};
