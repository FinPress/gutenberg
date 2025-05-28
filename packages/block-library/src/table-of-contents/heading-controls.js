/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

/**
 * Component that adds TOC visibility controls to heading blocks.
 *
 * @param {Object} props         Component props.
 * @param {string} props.content The heading block's content.
 *
 * @return {Component|null} The component or null if no TOC block exists.
 */
export default function HeadingTOCControls( { content } ) {
	const {
		tocBlocks,
		isHiddenFromTOC,
		getBlockAttributes: retrieveBlockAttributes,
	} = useSelect(
		( select ) => {
			const { getBlocksByName, getBlockAttributes } =
				select( blockEditorStore );
			const tocBlockIds = getBlocksByName( 'core/table-of-contents' );

			// Get hidden headings from all TOC blocks
			let hiddenHeadings = [];
			tocBlockIds.forEach( ( tocId ) => {
				const tocAttributes = getBlockAttributes( tocId );
				if ( tocAttributes?.hiddenHeadings ) {
					hiddenHeadings = [
						...hiddenHeadings,
						...tocAttributes.hiddenHeadings,
					];
				}
			} );

			return {
				tocBlocks: tocBlockIds,
				isHiddenFromTOC: hiddenHeadings.includes( content ),
				getBlockAttributes,
			};
		},
		[ content ]
	);

	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	// If no TOC blocks exist, don't render controls
	if ( tocBlocks.length === 0 ) {
		return null;
	}

	const toggleTOCVisibility = ( isVisible ) => {
		// Update all TOC blocks
		tocBlocks.forEach( ( tocId ) => {
			const tocAttributes = retrieveBlockAttributes( tocId );
			const currentHiddenHeadings = tocAttributes?.hiddenHeadings || [];

			let newHiddenHeadings;
			if ( isVisible ) {
				// Remove from hidden list
				newHiddenHeadings = currentHiddenHeadings.filter(
					( headingContent ) => headingContent !== content
				);
			} else {
				// Add to hidden list
				newHiddenHeadings = currentHiddenHeadings.includes( content )
					? currentHiddenHeadings
					: [ ...currentHiddenHeadings, content ];
			}

			updateBlockAttributes( tocId, {
				hiddenHeadings: newHiddenHeadings,
			} );
		} );
	};

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Table of Contents' ) }>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __( 'Show in Table of Contents' ) }
					checked={ ! isHiddenFromTOC }
					onChange={ toggleTOCVisibility }
					help={
						! isHiddenFromTOC
							? __(
									'This heading will appear in the Table of Contents.'
							  )
							: __(
									'This heading will be hidden from the Table of Contents.'
							  )
					}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
