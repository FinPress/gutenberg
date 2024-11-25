/**
 * External dependencies
 */
import Textarea from 'react-autosize-textarea';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useMemo } from '@wordpress/element';
import { __unstableSerializeAndCleanWithYdoc } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { useInstanceId } from '@wordpress/compose';
import { VisuallyHidden } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';

/**
 * Displays the Post Text Editor along with content in Visual and Text mode.
 *
 * @return {React.ReactNode} The rendered PostTextEditor component.
 */
export default function PostTextEditor() {
	const instanceId = useInstanceId( PostTextEditor );
	const { content, blocks, type, id, entityConfig } = useSelect( ( select ) => {
		const { getEditedEntityRecord, getEntityConfig } = select( coreStore );
		const { getCurrentPostType, getCurrentPostId } = select( editorStore );
		const _type = getCurrentPostType();
		const _id = getCurrentPostId();
		const editedRecord = getEditedEntityRecord( 'postType', _type, _id );
		const _entityConfig = getEntityConfig('postType', _type)
		return {
			entityConfig: _entityConfig,
			content: editedRecord?.content,
			blocks: editedRecord?.blocks,
			type: _type,
			id: _id,
		};
	}, [] );
	const { editEntityRecord } = useDispatch( coreStore );
	// Replicates the logic found in getEditedPostContent().
	const value = useMemo( () => {
		if ( content instanceof Function ) {
			return content( { blocks } );
		} else if ( blocks ) {
			const objectId = entityConfig.getSyncObjectId( id );
			// If we have parsed blocks already, they should be our source of truth.
			// Parsing applies block deprecations and legacy block conversions that
			// unparsed content will not have.
			return __unstableSerializeAndCleanWithYdoc(
				blocks,
				entityConfig.syncObjectType,
				objectId
			);
		}
		return content;
	}, [ content, blocks ] );

	return (
		<>
			<VisuallyHidden
				as="label"
				htmlFor={ `post-content-${ instanceId }` }
			>
				{ __( 'Type text or HTML' ) }
			</VisuallyHidden>
			<Textarea
				autoComplete="off"
				dir="auto"
				value={ value }
				onChange={ ( event ) => {
					editEntityRecord( 'postType', type, id, {
						content: event.target.value,
						blocks: undefined,
						selection: undefined,
					} );
				} }
				className="editor-post-text-editor"
				id={ `post-content-${ instanceId }` }
				placeholder={ __( 'Start writing with text or HTML' ) }
			/>
		</>
	);
}
