import { ipcMain, IpcMainEvent } from 'electron';

export const requestData = <T>(
	requestChannel: string,
	replyChannel: string,
	event: IpcMainEvent,
): Promise<T> => {
	return new Promise<T>((resolve) => {
		const handler = (_event, data) => {
			resolve(data);
			ipcMain.removeListener(replyChannel, handler);
		};

		event.sender.send(requestChannel);
		ipcMain.on(replyChannel, handler);
	});
};
