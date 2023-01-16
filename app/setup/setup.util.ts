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

export const cfgRemove = (config: string, key: string) =>
	config.replace(new RegExp(`^${key}=.*$`, 'gm'), '');
