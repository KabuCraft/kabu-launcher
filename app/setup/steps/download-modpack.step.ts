import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { exec } from 'child_process';

import { SetupStepConfig } from '../types';
import {
	BASE_URL,
	DATA_DIR,
	LAUNCHER_DIR,
	LAUNCHER_EXECUTABLE,
} from '../const';

const VERSION_FILE = 'version.json';
const VERSION_FILE_PATH = path.join(DATA_DIR, VERSION_FILE);

export const downloadModpackStep: SetupStepConfig = {
	run: async () => {
		let currentVersion = undefined;
		if (fs.existsSync(VERSION_FILE_PATH)) {
			const contents = await fs.promises.readFile(VERSION_FILE_PATH);
			currentVersion = JSON.parse(contents.toString()).latest;
		}

		const { data } = await axios.get(`${BASE_URL}/${VERSION_FILE}`);
		if (data.latest === currentVersion) {
			return;
		}

		const modpackURL = `${BASE_URL}/KabuPack-${data.latest}.zip`;
		await new Promise<void>((resolve, reject) =>
			exec(`${LAUNCHER_EXECUTABLE} --import ${modpackURL}`, (error, stdout) => {
        console.log(stdout);
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			}),
		);
	},
};
