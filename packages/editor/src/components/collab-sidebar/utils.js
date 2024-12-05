/**
 * Sanitizes a comment string by removing non-printable ASCII characters.
 *
 * @param {string} str - The comment string to sanitize.
 * @return {string} - The sanitized comment string.
 */
export function sanitizeCommentString( str ) {
	return str.trim();
}

export const getBlockByCommentId = ( blocks, commentId ) => {
	for ( const block of blocks ) {
		if ( block.attributes.blockCommentId === commentId ) {
			return block;
		}
		if ( block.innerBlocks && block.innerBlocks.length > 0 ) {
			const foundBlock = getBlockByCommentId(
				block.innerBlocks,
				commentId
			);
			if ( foundBlock ) {
				return foundBlock;
			}
		}
	}
	return blocks ? getBlockByCommentId( blocks, commentId ) : null;
};
