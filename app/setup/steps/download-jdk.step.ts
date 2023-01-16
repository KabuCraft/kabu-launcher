import fs from 'fs';
import path from 'path';

import { SetupStepConfig } from '../types';
import { DATA_DIR, JDK_DIR } from '../const';
import { downloadFile, extract } from '../../util';

const JDK_URL =
	'https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_windows-x64_bin.zip';

export const downloadJDKStep: SetupStepConfig = {
	run: async (event) => {
		if (fs.existsSync(JDK_DIR)) {
			return;
		}

		if (!fs.existsSync(DATA_DIR)) {
			await fs.promises.mkdir(DATA_DIR);
		}

		const fileName = 'jdk.zip';
		const targetDir = path.dirname(JDK_DIR);
		const zipDir = path.join(targetDir, fileName);
		await downloadFile(JDK_URL, zipDir, event);
		await extract(zipDir, JDK_DIR, true, true);
	},
};
