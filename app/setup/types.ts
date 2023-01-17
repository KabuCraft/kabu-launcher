import { IpcMainEvent } from 'electron';

/**
 * Config of a setup step.
 */
export interface SetupStepConfig {
	run: (event?: IpcMainEvent) => void | Promise<void>;
}
