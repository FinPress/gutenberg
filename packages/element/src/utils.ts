/**
 * Checks if the provided WP element is empty.
 *
 * @param {*} element WP element to check.
 * @return {boolean} True when an element is considered empty.
 */
export const isEmptyElement = ( element: unknown ): boolean => {
	if ( typeof element === 'number' ) {
		return false;
	}

	if (
		typeof ( element as { valueOf: () => unknown } )?.valueOf() ===
			'string' ||
		Array.isArray( element )
	) {
		return ! ( element as { length: number } ).length;
	}

	return ! element;
};
