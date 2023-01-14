export interface SetupStepConfig {
	run: () => void | Promise<void>;
}
