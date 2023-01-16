export class UserDataEvents {
	static readonly REQUEST_ID = 'request-nickname';
	static readonly REPLY_ID = 'reply-nickname';
}

export interface UserDataResponse {
	username: string;
}
