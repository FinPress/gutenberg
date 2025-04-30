/* eslint-env browser */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { createBlock, getDefaultBlockName } from '@wordpress/blocks';
import { copySmall } from '@wordpress/icons';
import { Button } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

export default function CodeEdit( {
	attributes,
	setAttributes,
	onRemove,
	insertBlocksAfter,
	mergeBlocks,
} ) {
	const blockProps = useBlockProps();
	const { content } = attributes;
	const { createNotice } = useDispatch( noticesStore );

	const copyToClipboard = () => {
		navigator?.clipboard
			.writeText( content?.text )
			.then( () => {
				createNotice( 'info', __( 'Copied Code to clipboard.' ), {
					isDismissible: true,
					type: 'snackbar',
				} );
			} )
			.catch( () => {
				createNotice(
					'error',
					__( 'Could not copy code to clipboard.' ),
					{
						isDismissible: true,
						type: 'snackbar',
					}
				);
			} );
	};

	return (
		<pre { ...blockProps }>
			<div className="wp-block-code__container">
				<RichText
					tagName="code"
					identifier="content"
					value={ content }
					onChange={ ( newContent ) =>
						setAttributes( { content: newContent } )
					}
					onRemove={ onRemove }
					onMerge={ mergeBlocks }
					placeholder={ __( 'Write code…' ) }
					aria-label={ __( 'Code' ) }
					preserveWhiteSpace
					__unstablePastePlainText
					__unstableOnSplitAtDoubleLineEnd={ () =>
						insertBlocksAfter(
							createBlock( getDefaultBlockName() )
						)
					}
				/>
				<Button
					__next40pxDefaultSize
					icon={ copySmall }
					onClick={ copyToClipboard }
					label={ __( 'Copy' ) }
					accessibleWhenDisabled
					disabled={ ! content.text }
				/>
			</div>
		</pre>
	);
}
