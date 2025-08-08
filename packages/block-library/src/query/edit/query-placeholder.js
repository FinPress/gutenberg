/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import {
	createBlocksFromInnerBlocksTemplate,
	store as blocksStore,
} from '@wordpress/blocks';
import { useState } from '@wordpress/element';
import {
	useBlockProps,
	store as blockEditorStore,
	__experimentalBlockVariationPicker,
} from '@wordpress/block-editor';
import { Button, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useScopedBlockVariations } from '../utils';
import { useBlockPatterns } from './pattern-selection';

/*
 * QueryPlaceholder component for rendering a placeholder with options to choose a pattern or start blank.
 *
 * @param {Object}   props 								Component props.
 * @param {Object}   props.attributes 					Block attributes.
 * @param {string}   props.clientId 					The client ID of the block.
 * @param {string}   props.name 						The block name.
 * @param {Function} props.openPatternSelectionModal 	Function to open the pattern selection modal.
 * @return {JSX.Element} 								The rendered QueryPlaceholder component.
 */
export default function QueryPlaceholder( {
	attributes,
	clientId,
	name,
	openPatternSelectionModal,
} ) {
	const [ isStartingBlank, setIsStartingBlank ] = useState( false );
	const blockProps = useBlockProps();
	const { blockType, activeBlockVariation } = useSelect(
		( select ) => {
			const { getActiveBlockVariation, getBlockType } =
				select( blocksStore );
			return {
				blockType: getBlockType( name ),
				activeBlockVariation: getActiveBlockVariation(
					name,
					attributes
				),
			};
		},
		[ name, attributes ]
	);
	const hasPatterns = !! useBlockPatterns( clientId, attributes ).length;
	const icon =
		activeBlockVariation?.icon?.src ||
		activeBlockVariation?.icon ||
		blockType?.icon?.src;
	const label = activeBlockVariation?.title || blockType?.title;
	if ( isStartingBlank ) {
		return (
			<QueryVariationPicker
				clientId={ clientId }
				attributes={ attributes }
				icon={ icon }
				label={ label }
			/>
		);
	}
	return (
		<div { ...blockProps }>
			<Placeholder
				icon={ icon }
				label={ label }
				instructions={ __(
					'Choose a pattern for the query loop or start blank.'
				) }
			>
				{ !! hasPatterns && (
					<Button
						__next40pxDefaultSize
						variant="primary"
						onClick={ openPatternSelectionModal }
					>
						{ __( 'Choose' ) }
					</Button>
				) }

				<Button
					__next40pxDefaultSize
					variant="secondary"
					onClick={ () => {
						setIsStartingBlank( true );
					} }
				>
					{ __( 'Start blank' ) }
				</Button>
			</Placeholder>
		</div>
	);
}

/*
 * QueryVariationPicker component for selecting a block variation.
 *
 * @param {Object}   props 						Component props.
 * @param {string}   props.clientId 			The client ID of the block.
 * @param {Object}   props.attributes 			Block attributes.
 * @param {string}   props.icon 				Icon for the variation picker.
 * @param {string}   props.label 				Label for the variation picker.
 * @return {JSX.Element} 						The rendered QueryVariationPicker component.
 */
function QueryVariationPicker( { clientId, attributes, icon, label } ) {
	const scopeVariations = useScopedBlockVariations( attributes );
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );
	const blockProps = useBlockProps();
	return (
		<div { ...blockProps }>
			<__experimentalBlockVariationPicker
				icon={ icon }
				label={ label }
				variations={ scopeVariations }
				onSelect={ ( variation ) => {
					if ( variation.innerBlocks ) {
						replaceInnerBlocks(
							clientId,
							createBlocksFromInnerBlocksTemplate(
								variation.innerBlocks
							),
							false
						);
					}
				} }
			/>
		</div>
	);
}
