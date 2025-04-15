/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

const instanceMap = new WeakMap< object, number >();

/**
 * Generates a 3-character sequence using numbers and lowercase letters.
 *
 * @return A random 3-character string.
 */
function generateSequence(): string {
	const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
	let result = '';
	for ( let i = 0; i < 3; i++ ) {
		// eslint-disable-next-line no-restricted-syntax
		result += chars.charAt( Math.floor( Math.random() * chars.length ) );
	}
	return result;
}

/**
 * Creates a new id for a given object.
 *
 * @param object Object reference to create an id for.
 * @param format Optional format type ('sequence' for xxx-yyy format).
 * @return The instance id (index or xxx-yyy format).
 */
function createId( object: object, format?: string ): string | number {
	const instances = instanceMap.get( object ) || 0;
	instanceMap.set( object, instances + 1 );

	if ( format === 'sequence' ) {
		const firstPart = generateSequence();
		const secondPart = generateSequence();
	return `${ firstPart }-${ secondPart }`;
	}

	return instances;
}

/**
 * Specify the useInstanceId *function* signatures.
 *
 * More accurately, useInstanceId distinguishes between three different
 * signatures:
 *
 * 1. When only object is given, the returned value is a number
 * 2. When object and prefix is given, the returned value is a string
 * 3. When preferredId is given, the returned value is the type of preferredId
 *
 * @param object Object reference to create an id for.
 */

function useInstanceId( object: object ): number;
function useInstanceId( object: object, prefix: string ): string;
function useInstanceId< T extends string | number >(
	object: object,
	prefix: string,
	preferredId?: T
): T;

/**
 * Provides a unique instance ID.
 *
 * @param object        Object reference to create an id for.
 * @param [prefix]      Prefix for the unique id.
 * @param [preferredId] Default ID to use.
 * @return The unique instance id.
 */
function useInstanceId(
	object: object,
	prefix?: string,
	preferredId?: string | number
): string | number {
	return useMemo( () => {
		if ( preferredId ) {
			return preferredId;
		}
		const id = prefix === 'wpf' ?
			createId( object, 'sequence' ) :
			createId( object );

		return prefix ? `${ prefix }-${ id }` : id;
	}, [ object, preferredId, prefix ] );
}

export default useInstanceId;