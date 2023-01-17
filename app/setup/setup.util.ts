/**
 * Adds or replaces a value in a .cfg format string.
 *
 * @param config
 * @param key
 * @param value
 * @param force
 */
export const cfgAddOrReplace = (
	config: string,
	key: string,
	value: any,
	force = false,
): string => {
	const regex = new RegExp(`^${key}=.*$`, 'm');
	const line = `${key}=${value}`;
	if (config.match(regex)) {
		if (!force) {
			return config;
		}

		return config.replace(regex, line);
	} else {
		return line + '\n' + config;
	}
};

/**
 * Removes a key from a .cfg format string.
 *
 * @param config
 * @param key
 */
export const cfgRemove = (config: string, key: string) =>
	config.replace(new RegExp(`^${key}=.*$`, 'gm'), '');
