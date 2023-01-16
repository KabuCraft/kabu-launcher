import '../main';

import { SetupStep } from '../../src/shared';
import { SetupStepConfig } from './types';
import {
	downloadJDKStep,
	downloadLauncherStep,
	downloadModpackStep,
	setupLauncherStep,
} from './steps';

export const setupConfig: { [key in SetupStep['key']]: SetupStepConfig } = {
	'download-jdk': downloadJDKStep,
	'download-launcher': downloadLauncherStep,
	'setup-launcher': setupLauncherStep,
	'download-modpack': downloadModpackStep,
};
