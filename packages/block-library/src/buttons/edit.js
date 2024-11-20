/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
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

function ButtonsEdit( { clientId, attributes, className, setAttributes } ) {
	const { fontSize, layout, style, isInnerBlockEmpty } = attributes;
	const blockProps = useBlockProps( {
		className: clsx( className, {
			'has-custom-font-size': fontSize || style?.typography?.fontSize,
		} ),
	} );
	const { hasButtonVariations } = useSelect( ( select ) => {
		const buttonVariations = select( blocksStore ).getBlockVariations(
			'core/button',
			'inserter'
		);
		return {
			hasButtonVariations: buttonVariations.length > 0,
		};
	}, [] );

	const isEmptyButtons = useSelect(
		( select ) => {
			const innerBlocks =
				select( blockEditorStore ).getBlocks( clientId );
			const buttonBlocks = innerBlocks.filter(
				( block ) => block.name === 'core/button'
			);

			if ( buttonBlocks.length === 0 ) {
				return true;
			}

			if ( buttonBlocks.length === 1 ) {
				const text = buttonBlocks[ 0 ]?.attributes?.text;

				const isEmptyOrInvalid =
					text === null ||
					text === undefined ||
					( typeof text === 'string' && text.trim() === '' ) ||
					( typeof text === 'object' &&
						Object.keys( text ).length === 0 );

				return isEmptyOrInvalid;
			}

			return false;
		},
		[ clientId ]
	);

	useEffect( () => {
		if ( isEmptyButtons !== isInnerBlockEmpty ) {
			setAttributes( { isInnerBlockEmpty: isEmptyButtons } );
		}
	}, [ isEmptyButtons, isInnerBlockEmpty, setAttributes ] );

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
