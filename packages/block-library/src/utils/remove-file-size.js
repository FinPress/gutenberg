/**
 * Removes file size from a string.
 *
 * @param {string} value The value to remove file size from.
 *
 * @return {string} The value with file size removed.
 */
export default function removeFileSize( value ) {
	// Remove the already added file size from the file name.
	return value.replace( /\s*\(\d+(\.\d{1,2})?\s*MB\)$/, '' );
}
