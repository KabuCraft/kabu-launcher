export interface SetupStep {
	key: string;
	label: string;
}

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
];

export interface SetupUpdate {
	key: string;
	error?: string;
}
