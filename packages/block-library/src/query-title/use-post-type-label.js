/**
 * WordPress dependencies
 */
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Hook to fetch the singular label for the current post type.
 *
 * @param {string} contextPostType Context provided post type.
 */
export function usePostTypeLabel( contextPostType ) {
	const currentPostType = useSelect( ( select ) => {
		// Access core/editor by string to avoid @wordpress/editor dependency.
		// See https://github.com/WordPress/gutenberg/blob/58a5abc7714bdff204d5f6bc350980f73686d54f/packages/block-library/src/query-title/use-archive-label.js#L9-L14
		// eslint-disable-next-line @wordpress/data-no-store-string-literals
		const { getCurrentPostType } = select( 'core/editor' );
		return getCurrentPostType();
	}, [] );

	// Fetch the post type label from the core data store
	return useSelect(
		( select ) => {
			const { getPostType } = select( coreStore );
			const postTypeSlug = contextPostType || currentPostType;
			const postType = getPostType( postTypeSlug );

			// Return the singular name of the post type
			return {
				postTypeLabel: postType ? postType.labels.singular_name : '',
			};
		},
		[ contextPostType, currentPostType ]
	);
}
