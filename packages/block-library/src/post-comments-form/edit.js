/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import {
	AlignmentControl,
	BlockControls,
	useBlockProps,
} from '@finpress/block-editor';
import { VisuallyHidden } from '@finpress/components';
import { useInstanceId } from '@finpress/compose';
import { __, sprintf } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import CommentsForm from './form';

export default function PostCommentsFormEdit( {
	attributes,
	context,
	setAttributes,
} ) {
	const { textAlign } = attributes;
	const { postId, postType } = context;

	const instanceId = useInstanceId( PostCommentsFormEdit );
	const instanceIdDesc = sprintf( 'comments-form-edit-%d-desc', instanceId );

	const blockProps = useBlockProps( {
		className: clsx( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
		'aria-describedby': instanceIdDesc,
	} );

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>
			<div { ...blockProps }>
				<CommentsForm postId={ postId } postType={ postType } />
				<VisuallyHidden id={ instanceIdDesc }>
					{ __( 'Comments form disabled in editor.' ) }
				</VisuallyHidden>
			</div>
		</>
	);
}
