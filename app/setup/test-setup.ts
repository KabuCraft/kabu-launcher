import fs from 'fs';
import { exec } from 'child_process';
import { log } from 'electron-log';

import { DATA_DIR, LAUNCHER_EXECUTABLE } from './const';
import { runSetup } from './setup';

/**
 * Runs a test run of the setup without needing a frontend.
 */
const run = async () => {
	if (fs.existsSync(DATA_DIR)) {
		log('Deleting existing data folder');
		await fs.promises.rm(DATA_DIR, { recursive: true, force: true });
	}

	await runSetup();
	exec(LAUNCHER_EXECUTABLE);
};

run();
