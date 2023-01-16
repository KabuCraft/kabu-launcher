import { IpcMainEvent } from 'electron';

export interface SetupStepConfig {
	run: (event?: IpcMainEvent) => void | Promise<void>;
}
