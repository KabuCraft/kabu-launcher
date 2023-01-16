import { Component } from '@angular/core';

import { ElectronService } from '../core/services';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.scss'],
})
export class GameComponent {
	constructor(private electron: ElectronService) {
		this.electron.send('launch-game', { instance: 'KabuPack' });
	}
}
