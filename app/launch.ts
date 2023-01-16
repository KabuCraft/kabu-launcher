import { app, ipcMain } from 'electron';
import { spawn } from 'child_process';
import { LAUNCHER_EXECUTABLE } from './setup/const';

if (ipcMain) {
	ipcMain.on('launch-game', (_event, { instance }) => {
		const child = spawn(LAUNCHER_EXECUTABLE, ['--launch', instance], {
			detached: true,
			stdio: [],
		});
		child.unref();
		app.exit(0);
	});
}
