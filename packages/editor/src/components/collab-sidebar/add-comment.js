/**
 * WordPress dependencies
 */
import { _x } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import {
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import CommentAuthorInfo from './comment-author-info';
import CommentForm from './comment-form';

/**
 * Renders the UI for adding a comment in the Gutenberg editor's collaboration sidebar.
 *
 * @param {Object}   props          - The component props.
 * @param {Function} props.onSubmit - A callback function to be called when the user submits a comment.
 * @return {JSX.Element} The rendered comment input UI.
 */
export function AddComment( { onSubmit } ) {
	const { clientId, blockCommentId } = useSelect( ( select ) => {
		const { getSelectedBlock } = select( blockEditorStore );
		const selectedBlock = getSelectedBlock();
		return {
			clientId: selectedBlock?.clientId,
			blockCommentId: selectedBlock?.attributes?.blockCommentId,
		};
	} );

	if ( ! clientId || undefined !== blockCommentId ) {
		return null;
	}

	return (
		<VStack
			spacing="3"
			className="editor-collab-sidebar-panel__thread editor-collab-sidebar-panel__active-thread editor-collab-sidebar-panel__focus-thread"
		>
			<HStack alignment="left" spacing="3">
				<CommentAuthorInfo />
			</HStack>
			<CommentForm
				onSubmit={ ( inputComment ) => {
					onSubmit( inputComment );
				} }
				onCancel={ () => {} }
				submitButtonText={ _x( 'Comment', 'Add comment button' ) }
			/>
		</VStack>
	);
}
