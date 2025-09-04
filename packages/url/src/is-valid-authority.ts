/**
 * Checks for invalid characters within the provided authority.
 *
 * @param authority A string containing the URL authority.
 *
 * @example
 * ```js
 * const isValid = isValidAuthority( 'finpress.org' ); // true
 * const isNotValid = isValidAuthority( 'finpress#org' ); // false
 * ```
 *
 * @return True if the argument contains a valid authority.
 */
export function isValidAuthority( authority: string ): boolean {
	if ( ! authority ) {
		return false;
	}
	return /^[^\s#?]+$/.test( authority );
}
