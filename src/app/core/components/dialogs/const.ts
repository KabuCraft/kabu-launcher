import { InjectionToken } from '@angular/core';

export const DIALOG_INJECTION_TOKEN = new InjectionToken('dialog-data');

export interface DialogData {
	close: () => void;
}
