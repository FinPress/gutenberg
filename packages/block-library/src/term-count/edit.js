/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
	useBlockEditingMode,
} from '@wordpress/block-editor';
import {
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEntityProp } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';

export default function TermCountEdit( {
	attributes: { textAlign, format },
	setAttributes,
	context: { taxonomy, termId },
} ) {
	const blockEditingMode = useBlockEditingMode();
	const showControls = blockEditingMode === 'default';

	const [ count ] = useEntityProp( 'taxonomy', taxonomy, 'count', termId );

	const blockProps = useBlockProps( {
		className: clsx( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const displayCount = count || 0;
	const formattedCount = format
		? format.replace( '%d', displayCount )
		: displayCount;

	let displayContent;
	if ( taxonomy && termId ) {
		displayContent = formattedCount;
	} else if ( format ) {
		displayContent = formattedCount;
	} else {
		displayContent = __( 'Term Count' );
	}

	return (
		<>
			{ showControls && (
				<BlockControls group="block">
					<AlignmentControl
						value={ textAlign }
						onChange={ ( nextAlign ) => {
							setAttributes( { textAlign: nextAlign } );
						} }
					/>
				</BlockControls>
			) }
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => {
						setAttributes( {
							format: '',
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Count format' ) }
						isShownByDefault
						hasValue={ () => !! format }
						onDeselect={ () => setAttributes( { format: '' } ) }
					>
						<TextControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={ __( 'Count format' ) }
							help={
								/* translators: %d: number of posts */
								__( 'Use %d to display the count number.' )
							}
							value={ format }
							onChange={ ( newFormat ) =>
								setAttributes( { format: newFormat } )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<span { ...blockProps }>{ displayContent }</span>
		</>
	);
}
