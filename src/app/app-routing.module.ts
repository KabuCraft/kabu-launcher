import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { SetupRoutingModule } from './setup/setup-routing.module';
import { GameRoutingModule } from './game/game-routing.module';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'setup',
		pathMatch: 'full',
	},
	{
		path: '**',
		component: PageNotFoundComponent,
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
		SetupRoutingModule,
		GameRoutingModule,
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
