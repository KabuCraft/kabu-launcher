import { Subject } from 'rxjs';
import { Directive, OnDestroy } from '@angular/core';

@Directive()
export class BaseComponent implements OnDestroy {
	protected ngDestroyed$ = new Subject<void>();

	ngOnDestroy() {
		this.ngDestroyed$.next();
		this.ngDestroyed$.complete();
	}
}
