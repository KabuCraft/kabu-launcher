import { InjectionToken } from '@angular/core';

export const DIALOG_INJECTION_TOKEN = new InjectionToken('dialog-data');

/**
 * Data to pass to dialog components.
 */
export interface DialogData {
	close: () => void;
}
