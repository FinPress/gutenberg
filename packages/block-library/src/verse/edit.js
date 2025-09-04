/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import {
	RichText,
	BlockControls,
	AlignmentToolbar,
	useBlockProps,
} from '@finpress/block-editor';
import { createBlock, getDefaultBlockName } from '@finpress/blocks';

export default function VerseEdit( {
	attributes,
	setAttributes,
	mergeBlocks,
	onRemove,
	insertBlocksAfter,
	style,
} ) {
	const { textAlign, content } = attributes;
	const blockProps = useBlockProps( {
		className: clsx( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
		style,
	} );

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>
			<RichText
				tagName="pre"
				identifier="content"
				preserveWhiteSpace
				value={ content }
				onChange={ ( nextContent ) => {
					setAttributes( {
						content: nextContent,
					} );
				} }
				aria-label={ __( 'Verse text' ) }
				placeholder={ __( 'Write verse…' ) }
				onRemove={ onRemove }
				onMerge={ mergeBlocks }
				textAlign={ textAlign }
				{ ...blockProps }
				__unstablePastePlainText
				__unstableOnSplitAtDoubleLineEnd={ () =>
					insertBlocksAfter( createBlock( getDefaultBlockName() ) )
				}
			/>
		</>
	);
}
