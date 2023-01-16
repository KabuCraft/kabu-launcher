import fs from 'fs';
import path from 'path';
import os from 'os';

import { SetupStepConfig } from '../types';
import { JDK_DIR, LAUNCHER_DIR, LAUNCHER_DIST } from '../const';
import { cfgAddOrReplace } from '../setup.util';

const LAUNCHER_CONFIG_FILE_NAME = LAUNCHER_DIST.toLowerCase() + '.cfg';

const MAX_MAX_MEMORY = 8192 * 1024 * 1024;
const MIN_MIN_MEMORY = 1024 * 1024 * 1024;

export const setupLauncherStep: SetupStepConfig = {
	run: async () => {
		// Edit launcher config
		const configPath = path.join(LAUNCHER_DIR, LAUNCHER_CONFIG_FILE_NAME);

		let config: string;
		if (fs.existsSync(configPath)) {
			config = (await fs.promises.readFile(configPath)).toString();
		} else {
			config = '';
		}

		const javaPath = path.join(JDK_DIR, 'bin', 'javaw.exe');

		config = cfgAddOrReplace(
			config,
			'JavaPath',
			path.resolve(javaPath).replace(/\\/g, '/'),
			true,
		);

		config = cfgAddOrReplace(config, 'ApplicationTheme', 'dark');
		config = cfgAddOrReplace(config, 'Language', 'en_US');
		config = cfgAddOrReplace(config, 'Analytics', 'true');
		config = cfgAddOrReplace(config, 'AnalyticsSeen', '2');
		config = cfgAddOrReplace(config, 'ShownNotifications', '');
		config = cfgAddOrReplace(config, 'LastHostname', os.hostname());

		let maxMemory = os.totalmem() / 2;
		if (maxMemory > MAX_MAX_MEMORY) {
			maxMemory = MAX_MAX_MEMORY;
		}

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

		await fs.promises.writeFile(configPath, config);
	},
};
