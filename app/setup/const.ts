import path from 'path';
import { app } from 'electron';

/**
 * The operating system type.
 */
const platform = process.platform;

/**
 * Base path.
 */
const basePath = app ? app.getPath('userData') + path.sep : '';
export const DATA_DIR = basePath + 'data';

/**
 * Path of the JDK directory.
 */
export const JDK_DIR = path.join(DATA_DIR, 'jdk');

/**
 * Path of the launcher directory and files.
 */
export const LAUNCHER_DIST = process.env['LAUNCHER_DIST'] || 'MultiMC';
export const LAUNCHER_DIR = path.join(DATA_DIR, 'launcher');
export let LAUNCHER_EXECUTABLE = path.join(LAUNCHER_DIR, LAUNCHER_DIST);
if (platform === 'win32') {
	LAUNCHER_EXECUTABLE += '.exe';
}

/**
 * Path of the instances' directory.
 */
export const INSTANCES_DIR = path.join(LAUNCHER_DIR, 'instances');
export const INSTANCE_NAME = 'KabuPack';

/**
 * Base URL for KabuPack downloads.
 */
export const BASE_URL = 'https://foxsgr.duckdns.org';
