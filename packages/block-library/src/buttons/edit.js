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
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blocksStore } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';

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
	const blockProps = useBlockProps( {
		className: clsx( className, {
			'has-custom-font-size': fontSize || style?.typography?.fontSize,
		} ),
	} );
	const { removeBlock, __unstableMarkNextChangeAsNotPersistent } =
		useDispatch( blockEditorStore );
	const { hasButtonVariations, innerBlocks } = useSelect(
		( select ) => {
			const buttonVariations = select( blocksStore ).getBlockVariations(
				'core/button',
				'inserter'
			);
			return {
				hasButtonVariations: buttonVariations.length > 0,
				innerBlocks: select( blockEditorStore ).getBlocks( clientId ),
			};
		},
		[ clientId ]
	);

	// Remove this buttons block if it has no inner blocks (button children)
	useEffect( () => {
		if ( innerBlocks.length === 0 ) {
			// Mark this change as not persistent so it doesn't create a separate undo step
			__unstableMarkNextChangeAsNotPersistent();
			removeBlock( clientId );
		}
	}, [
		innerBlocks.length,
		removeBlock,
		clientId,
		__unstableMarkNextChangeAsNotPersistent,
	] );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		defaultBlock: DEFAULT_BLOCK,
		// This check should be handled by the `Inserter` internally to be consistent across all blocks that use it.
		directInsert: ! hasButtonVariations,
		template: [ [ 'core/button' ] ],
		templateInsertUpdatesSelection: true,
		orientation: layout?.orientation ?? 'horizontal',
	} );

	return <div { ...innerBlocksProps } />;
}

export default ButtonsEdit;
