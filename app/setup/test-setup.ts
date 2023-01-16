import fs from 'fs';
import { exec } from 'child_process';
import { log } from 'electron-log';

import { DATA_DIR, LAUNCHER_EXECUTABLE } from './const';
import { runSetup } from './setup';

const run = async () => {
	if (fs.existsSync(DATA_DIR)) {
		log('Deleting existing data folder');
		await fs.promises.rm(DATA_DIR, { recursive: true, force: true });
	}

	await runSetup();
	exec(LAUNCHER_EXECUTABLE);
};

run();
