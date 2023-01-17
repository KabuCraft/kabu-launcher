import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';

import { ElectronService } from '../../services';
import { BaseComponent } from '../../../shared';
import { UserDataEvents } from '../../../../../app/shared';
import { UserDataDialogComponent } from '../user-data-dialog/user-data-dialog.component';
import { DIALOG_INJECTION_TOKEN, DialogData } from '../dialogs/const';

interface Dialog {
	id: any;
	component: any;
	injector: Injector;
}

const MAPPING: { [key: string]: any } = {};
MAPPING[UserDataEvents.REQUEST_ID] = UserDataDialogComponent;

/**
 * Component to manage requests from the backend.
 */
@Component({
	selector: 'app-communication-manager',
	templateUrl: './communication-manager.component.html',
})
export class CommunicationManagerComponent
	extends BaseComponent
	implements OnInit
{
	/**
	 * The dialogs being shown.
	 */
	dialogs: Dialog[] = [];

	constructor(
		private electron: ElectronService,
		private cdr: ChangeDetectorRef,
		private injector: Injector,
	) {
		super();
	}

	ngOnInit() {
		for (const [key, value] of Object.entries(MAPPING)) {
			this.listen(key, value);
		}
	}

	/**
	 * Track by function for dialogs.
	 *
	 * @param _index
	 * @param dialog
	 */
	trackByDialog(_index: number, dialog: Dialog) {
		return dialog.id;
	}

	/**
	 * Registers the listener and handler to an event.
	 *
	 * @param channel
	 * @param component
	 * @private
	 */
	private listen(channel: string, component: any) {
		this.electron
			.on(channel)
			.pipe(takeUntil(this.ngDestroyed$))
			.subscribe(() => {
				const id = +new Date();

				const injector = Injector.create({
					providers: [
						{
							provide: DIALOG_INJECTION_TOKEN,
							useValue: this.baseDialogData(id),
						},
					],
					parent: this.injector,
				});
				this.dialogs.push({
					id,
					component,
					injector,
				});
				this.cdr.detectChanges();
			});
	}

	/**
	 * Builds dialog data.
	 *
	 * @param id
	 * @private
	 */
	private baseDialogData(id: any): DialogData {
		return {
			close: () => {
				const index = this.dialogs.findIndex((d) => d.id === id);
				this.dialogs.splice(index, 1);
				this.cdr.detectChanges();
			},
		};
	}
}
