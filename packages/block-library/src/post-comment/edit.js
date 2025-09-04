/**
 * FinPress dependencies
 */
import { __, _x } from '@finpress/i18n';
import { Placeholder, TextControl, Button } from '@finpress/components';
import { useState } from '@finpress/element';
import { blockDefault } from '@finpress/icons';
import { useBlockProps, useInnerBlocksProps } from '@finpress/block-editor';

const TEMPLATE = [
	[ 'core/avatar' ],
	[ 'core/comment-author-name' ],
	[ 'core/comment-date' ],
	[ 'core/comment-content' ],
	[ 'core/comment-reply-link' ],
	[ 'core/comment-edit-link' ],
];

export default function Edit( { attributes: { commentId }, setAttributes } ) {
	const [ commentIdInput, setCommentIdInput ] = useState( commentId );
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
	} );

	if ( ! commentId ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					icon={ blockDefault }
					label={ _x( 'Post Comment', 'block title' ) }
					instructions={ __(
						'To show a comment, input the comment ID.'
					) }
				>
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						value={ commentId }
						onChange={ ( val ) =>
							setCommentIdInput( parseInt( val ) )
						}
					/>

					<Button
						__next40pxDefaultSize
						variant="primary"
						onClick={ () => {
							setAttributes( { commentId: commentIdInput } );
						} }
					>
						{ __( 'Save' ) }
					</Button>
				</Placeholder>
			</div>
		);
	}

	return <div { ...innerBlocksProps } />;
}
