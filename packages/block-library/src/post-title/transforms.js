/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';
import { select } from '@wordpress/data';
// eslint-disable-next-line import/no-extraneous-dependencies
import { store as editorStore } from '@wordpress/editor';
export const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/heading', 'core/paragraph' ],
			transform: ( attributes ) =>
				createBlock( 'core/post-title', {
					textAlign: attributes.align || undefined, // Map alignment if available
				} ),
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/heading' ],
			transform: ( { textAlign } ) => {
				const postTitle =
					select( editorStore ).getEditedPostAttribute( 'title' ) ||
					__( 'Add a title…' );
				return createBlock( 'core/heading', {
					content: postTitle,
					align: textAlign,
				} );
			},
		},
		{
			type: 'block',
			blocks: [ 'core/paragraph' ],
			transform: ( { textAlign } ) => {
				const postTitle =
					select( editorStore ).getEditedPostAttribute( 'title' ) ||
					__( 'Add a title…' );
				return createBlock( 'core/paragraph', {
					content: postTitle,
					align: textAlign,
				} );
			},
		},
	],
};
export default transforms;
