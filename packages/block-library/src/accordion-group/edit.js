/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';
/**
 * Internal dependencies
 */
import {
	caret,
	chevron,
	chevronRight,
	circlePlus,
	plus,
} from '../accordion-item/icons';

const ACCORDION_BLOCK_NAME = 'core/accordion-item';
const ACCORDION_BLOCK = {
	name: ACCORDION_BLOCK_NAME,
};

export default function Edit( {
	attributes: { autoclose, icon, iconPosition },
	setAttributes,
} ) {
	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: [ [ ACCORDION_BLOCK_NAME ], [ ACCORDION_BLOCK_NAME ] ],
		defaultBlock: ACCORDION_BLOCK,
		directInsert: true,
	} );

	return (
		<>
			<InspectorControls key="setting">
				<PanelBody title={ __( 'Settings' ) } initialOpen>
					<ToggleControl
						isBlock
						__nextHasNoMarginBottom
						label={ __( 'Auto-close' ) }
						onChange={ ( value ) => {
							setAttributes( {
								autoclose: value,
							} );
						} }
						checked={ autoclose }
						help={ __(
							'Automatically close accordions when a new one is opened.'
						) }
					/>
					<ToggleGroupControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						isBlock
						label={ __( 'Icon' ) }
						value={ icon }
						onChange={ ( value ) =>
							setAttributes( { icon: value } )
						}
					>
						<ToggleGroupControlOptionIcon
							label="Plus"
							icon={ plus }
							value="plus"
						/>
						<ToggleGroupControlOptionIcon
							label="Chevron"
							icon={ chevron }
							value="chevron"
						/>
						<ToggleGroupControlOptionIcon
							label="Circle Plus"
							icon={ circlePlus }
							value="circlePlus"
						/>
						<ToggleGroupControlOptionIcon
							label="Caret"
							icon={ caret }
							value="caret"
						/>
						<ToggleGroupControlOptionIcon
							label="Chevron Right"
							icon={ chevronRight }
							value="chevronRight"
						/>
						<ToggleGroupControlOption
							label="None"
							value={ false }
						/>
					</ToggleGroupControl>
					<ToggleGroupControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						isBlock
						label={ __( 'Icon Position' ) }
						value={ iconPosition }
						onChange={ ( value ) => {
							setAttributes( { iconPosition: value } );
						} }
					>
						<ToggleGroupControlOption label="Left" value="left" />
						<ToggleGroupControlOption label="Right" value="right" />
					</ToggleGroupControl>
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
