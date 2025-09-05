/**
 * Browsers may use unexpected mime types, and they differ from browser to browser.
 * This function computes a flexible array of mime types from the mime type structured provided by the server.
 * Converts { jpg|jpeg|jpe: "image/jpeg" } into [ "image/jpeg", "image/jpg", "image/jpeg", "image/jpe" ]
 *
 * @param {?Object} fpMimeTypesObject Mime type object received from the server.
 *                                    Extensions are keys separated by '|' and values are mime types associated with an extension.
 *
 * @return An array of mime types or null
 */
export function getMimeTypesArray(
	fpMimeTypesObject?: Record< string, string > | null
) {
	if ( ! fpMimeTypesObject ) {
		return null;
	}
	return Object.entries( fpMimeTypesObject ).flatMap(
		( [ extensionsString, mime ] ) => {
			const [ type ] = mime.split( '/' );
			const extensions = extensionsString.split( '|' );
			return [
				mime,
				...extensions.map(
					( extension ) => `${ type }/${ extension }`
				),
			];
		}
	);
}
