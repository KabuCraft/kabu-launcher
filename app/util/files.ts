import { IpcMainEvent } from 'electron';
import http from 'http';
import https from 'https';
import { log } from 'electron-log';
import path from 'path';
import fs from 'fs';
import decompress from 'decompress';
import AdmZip from 'adm-zip';
import fsExtra from 'fs-extra';

/**
 * Downloads a file from a given URL.
 * @param url
 * @param destination
 * @param event
 */
export const downloadFile = (
	url: string,
	destination: string,
	event?: IpcMainEvent,
): Promise<void> => {
	let client = url.startsWith('http:') ? http : https;
	log(`Downloading from '${url}' into '${path.resolve(destination)}'`);

	return new Promise((resolve, reject) => {
		const file = fs.createWriteStream(destination);
		const request = client.get(url, (response) => {
			if (response.statusCode === 301 || response.statusCode === 302) {
				downloadFile(response.headers.location, destination, event)
					.then(() => resolve())
					.catch((e) => reject(e));
				return;
			}

			if (response.statusCode !== 200) {
				reject(
					new Error(`Could not get the file. Status ${response.statusCode}`),
				);
				return;
			}

			response.pipe(file);

			// Handle errors
			request.on('error', (err) => {
				reject(err);
				fs.unlink(destination, () => {});
			});

			// Report progress to front-end
			const totalSize = parseInt(response.headers['content-length'], 10);
			if (totalSize) {
				let downloaded = 0;
				response.on('data', (chunk) => {
					downloaded += chunk.length;
					const percentage = (downloaded / totalSize) * 100;

					if (event && !event.sender.isDestroyed()) {
						event.sender.send('download-progress', { progress: percentage });
					}
				});
			}
		});

		file.on('finish', () => file.close(() => resolve()));
		file.on('error', (err) => {
			reject(err);
			fs.unlink(destination, () => {});
		});
	});
};

/**
 * Extracts a zip file into a given directory.
 * @param source
 * @param target
 * @param singleEntry
 */
export const extract = async (
	source: string,
	target: string,
	singleEntry: boolean,
): Promise<void> => {
	log(`Extracting ${path.resolve(source)} into ${path.resolve(target)}`);

	if (source.endsWith('.zip')) {
		await extractZip(source, target, singleEntry);
	} else {
		await extractTarGz(source, target, singleEntry);
	}

	log(`Deleting source file ${path.resolve(source)}`);
	await fs.promises.rm(source);
};

/**
 * Extracts a zip file into a given directory.
 * @param source
 * @param target
 * @param singleEntry
 */
const extractZip = async (
	source: string,
	target: string,
	singleEntry: boolean,
) => {
	const zip = new AdmZip(source);

	const entries = zip.getEntries();
	if (singleEntry) {
		const mainEntry = entries[0];
		const parent = path.dirname(target);
		zip.extractEntryTo(mainEntry.entryName, parent, true);
		await fsExtra.move(path.join(parent, mainEntry.entryName), target);
	} else {
		zip.extractAllTo(target);
	}
};

/**
 * Extracts a tar.gz file into a given directory.
 * @param source
 * @param target
 * @param singleEntry
 */
const extractTarGz = async (
	source: string,
	target: string,
	singleEntry: boolean,
) => {
	await decompress(source, target, {
		strip: singleEntry ? 1 : 0,
	});
};

/**
 * Returns the extension of a file.
 * @param fileName
 */
export const extension = (fileName: string) => {
	if (fileName.endsWith('.tar.gz')) return 'tar.gz';
	return fileName.split('.').pop();
};
