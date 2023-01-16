import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import * as COMPONENTS from './components';
import { CommunicationManagerComponent } from './components';

@NgModule({
	declarations: [
		COMPONENTS.CommunicationManagerComponent,
		COMPONENTS.UserDataDialogComponent,
	],
	imports: [CommonModule, ReactiveFormsModule],
	exports: [CommunicationManagerComponent],
})
export class CoreModule {}
