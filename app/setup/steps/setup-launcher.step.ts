import fs from 'fs';
import path from 'path';
import os from 'os';

import { SetupStepConfig } from '../types';
import { JDK_DIR, LAUNCHER_DIR, LAUNCHER_DIST } from '../const';
import { cfgAddOrReplace } from '../setup.util';

const LAUNCHER_CONFIG_FILE_NAME = LAUNCHER_DIST.toLowerCase() + '.cfg';

const MAX_MAX_MEMORY = 8192 * 1024 * 1024;
const MIN_MIN_MEMORY = 1024 * 1024 * 1024;

/**
 * This step sets up the launcher by changing its configurations.
 */
export const setupLauncherStep: SetupStepConfig = {
	run: async () => {
		// Load the config if it exists
		const configPath = path.join(LAUNCHER_DIR, LAUNCHER_CONFIG_FILE_NAME);

		let config: string;
		if (fs.existsSync(configPath)) {
			config = (await fs.promises.readFile(configPath)).toString();
		} else {
			config = '';
		}

		// Set the built-in Java path
		let javaPath = path.join(JDK_DIR, 'bin', 'javaw');
		if (process.platform === 'win32') {
			javaPath += '.exe';
		}

		config = cfgAddOrReplace(
			config,
			'JavaPath',
			path.resolve(javaPath).replace(/\\/g, '/'),
			true,
		);

		// Setup defaults
		config = cfgAddOrReplace(config, 'ApplicationTheme', 'dark');
		config = cfgAddOrReplace(config, 'Language', 'en_US');
		config = cfgAddOrReplace(config, 'Analytics', 'true');
		config = cfgAddOrReplace(config, 'AnalyticsSeen', '2');
		config = cfgAddOrReplace(config, 'ShownNotifications', '');
		config = cfgAddOrReplace(config, 'LastHostname', os.hostname());
		config = setupRecommendedMemory(config);

		// Create or update the config file
		await fs.promises.writeFile(configPath, config);
	},
};

/**
 * Sets up the recommended memory values in the configuration.
 *
 * @param config
 */
const setupRecommendedMemory = (config: string): string => {
	// Max memory is either half of the total system memory or MAX_MAX_MEMORY
	let maxMemory = os.totalmem() / 2;
	if (maxMemory > MAX_MAX_MEMORY) {
		maxMemory = MAX_MAX_MEMORY;
	}

	// Min memory is the max memory subtracted by 2GB or MIN_MIN_MEMORY
	let minMemory = maxMemory - 2048 * 1024 * 1024;
	if (minMemory < MIN_MIN_MEMORY) {
		minMemory = MIN_MIN_MEMORY;
	}

	config = cfgAddOrReplace(
		config,
		'MaxMemAlloc',
		(maxMemory / 1024 / 1024).toFixed(0),
	);
	config = cfgAddOrReplace(
		config,
		'MinMemAlloc',
		(minMemory / 1024 / 1024).toFixed(0),
	);

	return config;
};
