import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';
import axios from 'axios';
import { log } from 'electron-log';

import { SetupStepConfig } from '../types';
import {
	BASE_URL,
	DATA_DIR,
	INSTANCES_DIR,
	INSTANCE_NAME,
	LAUNCHER_DIR,
	LAUNCHER_EXECUTABLE,
} from '../const';
import { cfgAddOrReplace, cfgRemove } from '../setup.util';
import { downloadFile, extract } from '../../util';

const VERSION_FILE = 'version.json';
const VERSION_FILE_PATH = path.join(DATA_DIR, VERSION_FILE);

const TEMP_MODPACK_PATH = path.join(DATA_DIR, 'temp_modpack');
const TEMP_MODPACK_FILE_NAME = 'temp_modpack.zip';

export const downloadModpackStep: SetupStepConfig = {
	run: async (event) => {
		// Compare current version with remote version
		let currentVersion = undefined;
		if (fs.existsSync(VERSION_FILE_PATH)) {
			log('Reading version file');
			const contents = await fs.promises.readFile(VERSION_FILE_PATH);
			currentVersion = JSON.parse(contents.toString()).latest;
		} else {
			log('Version file not found');
		}

		log('Current version: ', currentVersion);

    // Check the latest version
		const { data } = await axios.get(`${BASE_URL}/${VERSION_FILE}`);
		if (data.latest === currentVersion) {
			log('Up to date');
			return;
		}

		// Download the latest version into a temporary file
		log('Downloading modpack');
		const modpackURL = `${BASE_URL}/KabuPack-${data.latest}.zip`;
		const zipTarget = path.dirname(TEMP_MODPACK_PATH);
		const tempFilePath = path.join(zipTarget, TEMP_MODPACK_FILE_NAME);
		await downloadFile(modpackURL, tempFilePath, event);
		await extract(tempFilePath, TEMP_MODPACK_PATH, false, true);

		if (currentVersion === undefined) {
			await firstTimeSetup();
		} else {
			await updateInstance();
		}

		// Update the version file
		await fs.promises.writeFile(
			VERSION_FILE_PATH,
			JSON.stringify(data, null, 2),
		);
	},
};

const firstTimeSetup = async () => {
	log('Performing first time setup');

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
	await fs.promises.writeFile(instanceConfigPath, instanceConfig);
};

const updateInstance = async () => {
	log('Updating current instance');

	const minecraftPath = path.join(INSTANCES_DIR, INSTANCE_NAME, '.minecraft');

	// Replace current mods folder
	const instanceModsPath = path.join(minecraftPath, 'mods');
	await fs.promises.rm(instanceModsPath, { force: true, recursive: true });
	await fsExtra.move(
		path.join(TEMP_MODPACK_PATH, '.minecraft', 'mods'),
		instanceModsPath,
	);

	// Replace current config folder
	const instanceConfigsPath = path.join(minecraftPath, 'config');
	await fs.promises.rm(instanceConfigsPath, { force: true, recursive: true });
	await fsExtra.move(
		path.join(TEMP_MODPACK_PATH, '.minecraft', 'config'),
		instanceConfigsPath,
	);

	await fs.promises.rm(TEMP_MODPACK_PATH, { force: true, recursive: true });
};
