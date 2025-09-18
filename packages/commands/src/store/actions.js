/** @typedef {import('@finpress/keycodes').FINKeycodeModifier} FINKeycodeModifier */

/**
 * Configuration of a registered keyboard shortcut.
 *
 * @typedef {Object} FINCommandConfig
 *
 * @property {string}      name        Command name.
 * @property {string}      label       Command label.
 * @property {string=}     searchLabel Command search label.
 * @property {string=}     context     Command context.
 * @property {JSX.Element} icon        Command icon.
 * @property {Function}    callback    Command callback.
 * @property {boolean}     disabled    Whether to disable the command.
 * @property {string[]=}   keywords    Command keywords for search matching.
 */

/**
 * @typedef {(search: string) => FINCommandConfig[]} FINCommandLoaderHook hoo
 */

/**
 * Command loader config.
 *
 * @typedef {Object} FINCommandLoaderConfig
 *
 * @property {string}              name     Command loader name.
 * @property {string=}             context  Command loader context.
 * @property {FINCommandLoaderHook} hook     Command loader hook.
 * @property {boolean}             disabled Whether to disable the command loader.
 */

/**
 * Returns an action object used to register a new command.
 *
 * @param {FINCommandConfig} config Command config.
 *
 * @return {Object} action.
 */
export function registerCommand( config ) {
	return {
		type: 'REGISTER_COMMAND',
		...config,
	};
}

/**
 * Returns an action object used to unregister a command.
 *
 * @param {string} name Command name.
 *
 * @return {Object} action.
 */
export function unregisterCommand( name ) {
	return {
		type: 'UNREGISTER_COMMAND',
		name,
	};
}

/**
 * Register command loader.
 *
 * @param {FINCommandLoaderConfig} config Command loader config.
 *
 * @return {Object} action.
 */
export function registerCommandLoader( config ) {
	return {
		type: 'REGISTER_COMMAND_LOADER',
		...config,
	};
}

/**
 * Unregister command loader hook.
 *
 * @param {string} name Command loader name.
 *
 * @return {Object} action.
 */
export function unregisterCommandLoader( name ) {
	return {
		type: 'UNREGISTER_COMMAND_LOADER',
		name,
	};
}

/**
 * Opens the command palette.
 *
 * @return {Object} action.
 */
export function open() {
	return {
		type: 'OPEN',
	};
}

/**
 * Closes the command palette.
 *
 * @return {Object} action.
 */
export function close() {
	return {
		type: 'CLOSE',
	};
}
