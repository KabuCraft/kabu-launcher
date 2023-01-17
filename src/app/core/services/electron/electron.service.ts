import { Injectable } from '@angular/core';
import { finalize, Observable, Subject } from 'rxjs';
import { ipcRenderer } from 'electron';

@Injectable({ providedIn: 'root' })
export class ElectronService {
	private ipcRenderer: typeof ipcRenderer;

	constructor() {
		// Conditional imports
		if (this.isElectron) {
			this.ipcRenderer = window.require('electron').ipcRenderer;
		}
	}

	get isElectron(): boolean {
		return !!(window && window.process && window.process.type);
	}

	/**
	 * Creates a listener for a channel.
	 *
	 * @param channel
	 */
	on<T = any>(channel: string): Observable<T> {
		const subject = new Subject<T>();
		const handler = (_event, data) => subject.next(data);
		this.ipcRenderer.on(channel, handler);
		return subject.pipe(
			finalize(() => this.ipcRenderer.removeListener(channel, handler)),
		);
	}

	/**
	 * Sends a message to the backend.
	 *
	 * @param channel
	 * @param args
	 */
	send(channel: string, ...args: any[]) {
		this.ipcRenderer.send(channel, ...args);
	}
}
