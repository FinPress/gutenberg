/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	RichText,
	BlockControls,
	AlignmentToolbar,
	useBlockProps,
	InspectorControls,
	withColors,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { createBlock, getDefaultBlockName } from '@wordpress/blocks';
import { compose } from '@wordpress/compose';
import {
	RangeControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

function VerseEdit( {
	attributes,
	setAttributes,
	mergeBlocks,
	onRemove,
	insertBlocksAfter,
	overlayColor,
	setOverlayColor,
	clientId,
} ) {
	const { textAlign, content, style, dimRatio = 50 } = attributes;

	const hasBackgroundImage = style?.background?.backgroundImage;
	const overlayOpacity = dimRatio / 100;

	const blockProps = useBlockProps( {
		className: clsx( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
			'has-background-dim': hasBackgroundImage && overlayColor.color,
			[ `has-background-dim-${ dimRatio }` ]:
				hasBackgroundImage && overlayColor.color && dimRatio !== 50,
			[ overlayColor.class ]: hasBackgroundImage && overlayColor.class,
		} ),
		style: {
			...style,
		},
	} );

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	return (
		<>
			{ hasBackgroundImage && (
				<InspectorControls group="color">
					<ColorGradientSettingsDropdown
						__experimentalIsRenderedInSidebar
						settings={ [
							{
								colorValue: overlayColor.color,
								label: __( 'Overlay' ),
								onColorChange: setOverlayColor,
								isShownByDefault: true,
								resetAllFilter: () => ( {
									overlayColor: undefined,
									customOverlayColor: undefined,
								} ),
								clearable: true,
							},
						] }
						panelId={ clientId }
						{ ...colorGradientSettings }
					/>

					<ToolsPanelItem
						label={ __( 'Overlay opacity' ) }
						hasValue={ () => dimRatio !== 50 }
						onDeselect={ () => setAttributes( { dimRatio: 50 } ) }
						isShownByDefault
						panelId={ clientId }
					>
						<RangeControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Overlay opacity' ) }
							value={ dimRatio }
							onChange={ ( value ) =>
								setAttributes( { dimRatio: value } )
							}
							min={ 0 }
							max={ 100 }
							step={ 10 }
						/>
					</ToolsPanelItem>
				</InspectorControls>
			) }

			<BlockControls>
				<AlignmentToolbar
					value={ textAlign }
					onChange={ ( nextAlign ) =>
						setAttributes( { textAlign: nextAlign } )
					}
				/>
			</BlockControls>

			<div { ...blockProps }>
				<RichText
					tagName="pre"
					identifier="content"
					preserveWhiteSpace
					value={ content }
					onChange={ ( nextContent ) =>
						setAttributes( { content: nextContent } )
					}
					aria-label={ __( 'Verse text' ) }
					placeholder={ __( 'Write verse…' ) }
					onRemove={ onRemove }
					onMerge={ mergeBlocks }
					textAlign={ textAlign }
					__unstablePastePlainText
					__unstableOnSplitAtDoubleLineEnd={ () =>
						insertBlocksAfter(
							createBlock( getDefaultBlockName() )
						)
					}
				/>
				{ hasBackgroundImage && overlayColor.color && (
					<span
						className="wp-block-verse__overlay-layer"
						aria-hidden="true"
						style={ {
							backgroundColor: overlayColor.color,
							opacity: overlayOpacity,
						} }
					/>
				) }
			</div>
		</>
	);
}

export default compose( [
	withColors( { overlayColor: 'background-color' } ),
] )( VerseEdit );
