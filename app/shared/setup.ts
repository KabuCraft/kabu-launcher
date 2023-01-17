/**
 * A step of the setup process.
 */
export interface SetupStep {
	key: string;
	label: string;
}

/**
 * Setup steps data.
 */
export const setupSteps: SetupStep[] = [
	{
		key: 'download-jdk',
		label: 'Downloading Java',
	},
	{
		key: 'download-launcher',
		label: 'Downloading launcher',
	},
	{
		key: 'setup-launcher',
		label: 'Setting up launcher',
	},
	{
		key: 'download-modpack',
		label: 'Downloading Modpack',
	},
	{
		key: 'user-setup',
		label: 'Setting up user data',
	},
];

interface SetupErrorUpdate {
	key: string;
	error: any;
}

interface SetupProgressUpdate {
	key: string;
}

interface SetupCompleteUpdate {
	complete: boolean;
}

/**
 * A setup update sent from the backend to the frontend.
 */
export type SetupUpdate =
	| SetupErrorUpdate
	| SetupProgressUpdate
	| SetupCompleteUpdate;
