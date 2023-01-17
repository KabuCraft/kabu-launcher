import { Component } from '@angular/core';

import { ElectronService } from '../core/services';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.scss'],
})
export class GameComponent {
	constructor(private electron: ElectronService) {
		// Launch the game when the component is created (ngOnInit wasn't being called)
		this.electron.send('launch-game', { instance: 'KabuPack' });
	}
}
