const supportedMatchers = {
	error: 'toHaveErrored',
	info: 'toHaveInformed',
	log: 'toHaveLogged',
	warn: 'toHaveWarned',
} as const;

export default supportedMatchers;
