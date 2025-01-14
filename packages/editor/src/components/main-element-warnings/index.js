/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';

const checkMainTag = ( blocks, mainTagCount ) => {
	blocks.forEach( ( block ) => {
		if ( block.attributes.tagName === 'main' ) {
			mainTagCount++;
		}
		// If the block has innerBlocks, call the function again.
		if ( block.innerBlocks.length > 0 ) {
			mainTagCount = checkMainTag( block.innerBlocks, mainTagCount );
		}
	} );

	return mainTagCount;
};

export default function MainElementWarnings() {
	const { type, blocks } = useSelect( ( select ) => {
		const postType = select( editorStore ).getCurrentPostType();
		const { getBlocks } = select( blockEditorStore );
		return {
			type: postType,
			blocks: getBlocks(),
		};
	}, [] );

	const { createWarningNotice, removeNotice } = useDispatch( noticesStore );

	useEffect( () => {
		if ( 'wp_template' === type ) {
			const mainTagCount = checkMainTag( blocks, 0 );

			removeNotice( 'edit-site-main-notice' );

			if ( 0 === mainTagCount || 1 < mainTagCount ) {
				createWarningNotice(
					__( 'Your template should have exactly one main element.' ),
					{ id: 'edit-site-main-notice' }
				);
			}
		}
	}, [ type, blocks, createWarningNotice, removeNotice ] );

	return null;
}
