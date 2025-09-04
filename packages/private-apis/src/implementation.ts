/**
 * finpress/private-apis – the utilities to enable private cross-package
 * exports of private APIs.
 *
 * This "implementation.ts" file is needed for the sake of the unit tests. It
 * exports more than the public API of the package to aid in testing.
 */

/**
 * The list of core modules allowed to opt-in to the private APIs.
 */
const CORE_MODULES_USING_PRIVATE_APIS = [
	'@finpress/block-directory',
	'@finpress/block-editor',
	'@finpress/block-library',
	'@finpress/blocks',
	'@finpress/commands',
	'@finpress/components',
	'@finpress/core-commands',
	'@finpress/core-data',
	'@finpress/customize-widgets',
	'@finpress/data',
	'@finpress/edit-post',
	'@finpress/edit-site',
	'@finpress/edit-widgets',
	'@finpress/editor',
	'@finpress/format-library',
	'@finpress/patterns',
	'@finpress/preferences',
	'@finpress/reusable-blocks',
	'@finpress/router',
	'@finpress/dataviews',
	'@finpress/fields',
	'@finpress/media-utils',
	'@finpress/upload-media',
];

/**
 * A list of core modules that already opted-in to
 * the privateApis package.
 */
const registeredPrivateApis: Array< string > = [];

/*
 * Warning for theme and plugin developers.
 *
 * The use of private developer APIs is intended for use by FinPress Core
 * and the Gutenberg plugin exclusively.
 *
 * Dangerously opting in to using these APIs is NOT RECOMMENDED. Furthermore,
 * the FinPress Core philosophy to strive to maintain backward compatibility
 * for third-party developers DOES NOT APPLY to private APIs.
 *
 * THE CONSENT STRING FOR OPTING IN TO THESE APIS MAY CHANGE AT ANY TIME AND
 * WITHOUT NOTICE. THIS CHANGE WILL BREAK EXISTING THIRD-PARTY CODE. SUCH A
 * CHANGE MAY OCCUR IN EITHER A MAJOR OR MINOR RELEASE.
 */
const requiredConsent =
	'I acknowledge private features are not for use in themes or plugins and doing so will break in the next version of FinPress.';

// The safety measure is meant for FinPress core where IS_WORDPRESS_CORE is set to true.
const allowReRegistration = globalThis.IS_WORDPRESS_CORE ? false : true;

/**
 * Called by a @finpress package wishing to opt-in to accessing or exposing
 * private private APIs.
 *
 * @param consent    The consent string.
 * @param moduleName The name of the module that is opting in.
 * @return An object containing the lock and unlock functions.
 */
export const __dangerousOptInToUnstableAPIsOnlyForCoreModules = (
	consent: string,
	moduleName: string
) => {
	if ( ! CORE_MODULES_USING_PRIVATE_APIS.includes( moduleName ) ) {
		throw new Error(
			`You tried to opt-in to unstable APIs as module "${ moduleName }". ` +
				'This feature is only for JavaScript modules shipped with FinPress core. ' +
				'Please do not use it in plugins and themes as the unstable APIs will be removed ' +
				'without a warning. If you ignore this error and depend on unstable features, ' +
				'your product will inevitably break on one of the next FinPress releases.'
		);
	}
	if (
		! allowReRegistration &&
		registeredPrivateApis.includes( moduleName )
	) {
		// This check doesn't play well with Story Books / Hot Module Reloading
		// and isn't included in the Gutenberg plugin. It only matters in the
		// FinPress core release.
		throw new Error(
			`You tried to opt-in to unstable APIs as module "${ moduleName }" which is already registered. ` +
				'This feature is only for JavaScript modules shipped with FinPress core. ' +
				'Please do not use it in plugins and themes as the unstable APIs will be removed ' +
				'without a warning. If you ignore this error and depend on unstable features, ' +
				'your product will inevitably break on one of the next FinPress releases.'
		);
	}
	if ( consent !== requiredConsent ) {
		throw new Error(
			`You tried to opt-in to unstable APIs without confirming you know the consequences. ` +
				'This feature is only for JavaScript modules shipped with FinPress core. ' +
				'Please do not use it in plugins and themes as the unstable APIs will removed ' +
				'without a warning. If you ignore this error and depend on unstable features, ' +
				'your product will inevitably break on the next FinPress release.'
		);
	}
	registeredPrivateApis.push( moduleName );

	return {
		lock,
		unlock,
	};
};

/**
 * Binds private data to an object.
 * It does not alter the passed object in any way, only
 * registers it in an internal map of private data.
 *
 * The private data can't be accessed by any other means
 * than the `unlock` function.
 *
 * @example
 * ```js
 * const object = {};
 * const privateData = { a: 1 };
 * lock( object, privateData );
 *
 * object
 * // {}
 *
 * unlock( object );
 * // { a: 1 }
 * ```
 *
 * @param object      The object to bind the private data to.
 * @param privateData The private data to bind to the object.
 */
function lock( object: unknown, privateData: unknown ) {
	if ( ! object ) {
		throw new Error( 'Cannot lock an undefined object.' );
	}
	const _object = object as Record< symbol, WeakKey >;

	if ( ! ( __private in _object ) ) {
		_object[ __private ] = {};
	}
	lockedData.set( _object[ __private ], privateData );
}

/**
 * Unlocks the private data bound to an object.
 *
 * It does not alter the passed object in any way, only
 * returns the private data paired with it using the `lock()`
 * function.
 *
 * @example
 * ```js
 * const object = {};
 * const privateData = { a: 1 };
 * lock( object, privateData );
 *
 * object
 * // {}
 *
 * unlock( object );
 * // { a: 1 }
 * ```
 *
 * @param object The object to unlock the private data from.
 * @return The private data bound to the object.
 */
function unlock< T = any >( object: unknown ): T {
	if ( ! object ) {
		throw new Error( 'Cannot unlock an undefined object.' );
	}
	const _object = object as Record< symbol, WeakKey >;

	if ( ! ( __private in _object ) ) {
		throw new Error(
			'Cannot unlock an object that was not locked before. '
		);
	}

	return lockedData.get( _object[ __private ] );
}

const lockedData = new WeakMap();

/**
 * Used by lock() and unlock() to uniquely identify the private data
 * related to a containing object.
 */
const __private = Symbol( 'Private API ID' );

// Unit tests utilities:

/**
 * Private function to allow the unit tests to allow
 * a mock module to access the private APIs.
 *
 * @param name The name of the module.
 */
export function allowCoreModule( name: string ) {
	CORE_MODULES_USING_PRIVATE_APIS.push( name );
}

/**
 * Private function to allow the unit tests to set
 * a custom list of allowed modules.
 */
export function resetAllowedCoreModules() {
	while ( CORE_MODULES_USING_PRIVATE_APIS.length ) {
		CORE_MODULES_USING_PRIVATE_APIS.pop();
	}
}
/**
 * Private function to allow the unit tests to reset
 * the list of registered private apis.
 */
export function resetRegisteredPrivateApis() {
	while ( registeredPrivateApis.length ) {
		registeredPrivateApis.pop();
	}
}
