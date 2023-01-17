import '../main';

import { SetupStep } from '../shared';
import { SetupStepConfig } from './types';
import {
	downloadJDKStep,
	downloadLauncherStep,
	downloadModpackStep,
	setupLauncherStep,
	userSetupStep,
} from './steps';

/**
 * Config of each setup step.
 */
export const setupConfig: { [key in SetupStep['key']]: SetupStepConfig } = {
	'download-jdk': downloadJDKStep,
	'download-launcher': downloadLauncherStep,
	'setup-launcher': setupLauncherStep,
	'download-modpack': downloadModpackStep,
	'user-setup': userSetupStep,
};
