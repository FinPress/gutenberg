/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { store as blocksStore } from '@wordpress/blocks';
import { Placeholder } from '@wordpress/components';
import { button } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

const DEFAULT_BLOCK = {
	name: 'core/button',
	attributesToCopy: [
		'backgroundColor',
		'border',
		'className',
		'fontFamily',
		'fontSize',
		'gradient',
		'style',
		'textColor',
		'width',
	],
};

function ButtonsEdit( { attributes, className, clientId } ) {
	const { fontSize, layout, style } = attributes;

	const { hasButtonVariations, hasInnerBlocks, isSelected } = useSelect(
		( select ) => {
			const { getBlocks, isBlockSelected, hasSelectedInnerBlock } =
				select( blockEditorStore );
			const buttonVariations = select( blocksStore ).getBlockVariations(
				'core/button',
				'inserter'
			);
			const innerBlocks = getBlocks( clientId );
			const selected =
				isBlockSelected( clientId ) ||
				hasSelectedInnerBlock( clientId, true );

			return {
				hasButtonVariations: buttonVariations.length > 0,
				hasInnerBlocks: innerBlocks.length > 0,
				isSelected: selected,
			};
		},
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: clsx( className, {
			'has-custom-font-size': fontSize || style?.typography?.fontSize,
		} ),
	} );

	const innerBlocksProps = useInnerBlocksProps(
		hasInnerBlocks ? blockProps : {},
		{
			defaultBlock: DEFAULT_BLOCK,
			directInsert: ! hasButtonVariations,
			template: [ [ 'core/button' ] ],
			templateInsertUpdatesSelection: true,
			orientation: layout?.orientation ?? 'horizontal',
		}
	);

	// Show placeholder when block is empty and not selected.
	if ( ! hasInnerBlocks && ! isSelected ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					icon={ button }
					label={ __( 'Buttons' ) }
					className="wp-block-buttons-placeholder"
					isColumnLayout
				>
					<div className="wp-block-buttons-placeholder__help">
						{ __( 'Click to add button.' ) }
					</div>
				</Placeholder>
			</div>
		);
	}

	return <div { ...innerBlocksProps } />;
}

export default ButtonsEdit;
