import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';
import http from 'http';
import https from 'https';
import AdmZip from 'adm-zip';
import { IpcMainEvent } from 'electron';

export const cfgAddOrReplace = (
	config: string,
	key: string,
	value: any,
	force = false,
): string => {
	const regex = new RegExp(`^${key}=.*$`, 'm');
	const line = `${key}=${value}`;
	if (config.match(regex)) {
		if (!force) {
			return config;
		}

		return config.replace(regex, line);
	} else {
		return line + '\n' + config;
	}
};

export const cfgRemove = (config: string, key: string) =>
	config.replace(new RegExp(`^${key}=.*$`, 'gm'), '');

export const downloadFile = (
	url: string,
	destination: string,
	event?: IpcMainEvent,
): Promise<void> => {
	let client = url.startsWith('http:') ? http : https;

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

			const totalSize = parseInt(response.headers['content-length'], 10);
			if (totalSize) {
				let downloaded = 0;
				response.on('data', (chunk) => {
					downloaded += chunk.length;
					const percentage = (downloaded / totalSize) * 100;

					if (event && !event.sender.isDestroyed()) {
						event.sender.send('download-progress', percentage);
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

export const extract = async (
	source: string,
	target: string,
  singleEntry: boolean,
	deleteSource: boolean,
): Promise<void> => {
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

	if (deleteSource) {
		await fs.promises.rm(source);
	}
};
