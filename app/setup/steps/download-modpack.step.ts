import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';
import axios from 'axios';

import { SetupStepConfig } from '../types';
import {
	BASE_URL,
	DATA_DIR,
	INSTANCES_DIR,
	INSTANCE_NAME,
	LAUNCHER_DIR,
	LAUNCHER_EXECUTABLE,
} from '../const';
import {
	cfgAddOrReplace,
	cfgRemove,
	downloadFile,
	extract,
} from '../setup.util';

const VERSION_FILE = 'version.json';
const VERSION_FILE_PATH = path.join(DATA_DIR, VERSION_FILE);

const TEMP_MODPACK_PATH = path.join(DATA_DIR, 'temp_modpack');
const TEMP_MODPACK_FILE_NAME = 'temp_modpack.zip';

export const downloadModpackStep: SetupStepConfig = {
	run: async (event) => {
		// Compare current version with remote version
		let currentVersion = undefined;
		if (fs.existsSync(VERSION_FILE_PATH)) {
			const contents = await fs.promises.readFile(VERSION_FILE_PATH);
			currentVersion = JSON.parse(contents.toString()).latest;
		}

		const { data } = await axios.get(`${BASE_URL}/${VERSION_FILE}`);
		if (data.latest === currentVersion) {
			return;
		}

		// Download the latest version into a temporary file
		const modpackURL = `${BASE_URL}/KabuPack-${data.latest}.zip`;
		const zipTarget = path.dirname(TEMP_MODPACK_PATH);
		const tempFilePath = path.join(zipTarget, TEMP_MODPACK_FILE_NAME);
		await downloadFile(modpackURL, tempFilePath, event);
		await extract(tempFilePath, TEMP_MODPACK_PATH, false, true);

		if (currentVersion === undefined) {
			await firstTimeSetup();
		}

		// Update the version file
		await fs.promises.writeFile(
			VERSION_FILE_PATH,
			JSON.stringify(data, null, 2),
		);
	},
};

const firstTimeSetup = async () => {
	const instanceTarget = path.join(INSTANCES_DIR, INSTANCE_NAME);

	// If there is no current version, just move the instance
	await fsExtra.move(TEMP_MODPACK_PATH, instanceTarget, { overwrite: true });

	// Edit the instance config
	const instanceConfigPath = path.join(
		INSTANCES_DIR,
		INSTANCE_NAME,
		'instance.cfg',
	);
	let instanceConfig = (
		await fs.promises.readFile(instanceConfigPath)
	).toString();
	instanceConfig = cfgRemove(instanceConfig, 'Java\\w+');
	instanceConfig = cfgRemove(instanceConfig, '\\w+MemAlloc');
	instanceConfig = cfgAddOrReplace(instanceConfig, 'name', INSTANCE_NAME, true);
	console.log(instanceConfig);
	await fs.promises.writeFile(instanceConfigPath, instanceConfig);
};
