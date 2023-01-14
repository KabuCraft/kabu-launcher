import fs from 'fs';
import path from 'path';
import * as getFile from 'async-get-file';
import * as decompress from 'decompress';

import { SetupStepConfig } from '../types';
import { DATA_DIR, JDK_DIR } from '../const';

const JDK_URL =
	'https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_windows-x64_bin.zip';

export const downloadJDKStep: SetupStepConfig = {
	run: async () => {
		if (fs.existsSync(JDK_DIR)) {
			return;
		}

		if (!fs.existsSync(DATA_DIR)) {
			await fs.promises.mkdir(DATA_DIR);
		}

		const fileName = 'jdk.zip';
		await getFile(JDK_URL, {
			directory: DATA_DIR,
			filename: fileName,
		});

		const zipDir = path.join(DATA_DIR, fileName);
		await decompress(zipDir, JDK_DIR);
		await fs.promises.rm(zipDir);
	},
};
