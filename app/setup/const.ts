import path from 'path';
import { app } from 'electron';

const basePath = app ? app.getPath('userData') + path.sep : '';
export const DATA_DIR = basePath + 'data';

export const JDK_DIR = path.join(DATA_DIR, 'jdk');

export const LAUNCHER_DIST = process.env['LAUNCHER_DIST'] || 'MultiMC';
export const LAUNCHER_URL =
	process.env['LAUNCHER_URL'] ||
	'https://files.multimc.org/downloads/mmc-stable-windows.zip';

export const LAUNCHER_DIR = path.join(DATA_DIR, 'launcher');
export const LAUNCHER_EXECUTABLE = path.join(
	LAUNCHER_DIR,
	LAUNCHER_DIST + '.exe',
);

export const INSTANCES_DIR = path.join(LAUNCHER_DIR, 'instances');
export const INSTANCE_NAME = 'KabuPack';

export const BASE_URL = 'http://kabupack.ddns.net';
