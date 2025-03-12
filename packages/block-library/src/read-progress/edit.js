/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	PanelColorSettings,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	CustomSelectControl,
	RangeControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';

export default function ReadMore( { attributes, setAttributes } ) {
	const { backgroundColor, progressColor, height, position } = attributes;
	const blockProps = useBlockProps();

	const readProgressStyle = {
		backgroundColor,
		height: height + 'px',
	};

	const progressStyle = {
		backgroundColor: progressColor,
		height: height + 'px',
		transform: 'scaleX(0.5)',
	};

	if ( position === 'bottom' ) {
		readProgressStyle.top = 'auto';
		progressStyle.top = 'auto';
		readProgressStyle.bottom = 0;
		progressStyle.bottom = 0;
	}

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Progress Bar Settings' ) }
					resetAll={ () => {
						setAttributes( {
							height: 11,
							position: 'top',
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Bar height' ) }
						isShownByDefault
						hasValue={ () => height !== 11 }
						onDeselect={ () => setAttributes( { height: 11 } ) }
					>
						<RangeControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Bar height' ) }
							help={ __( 'Height in pixels' ) }
							value={ height }
							onChange={ ( heightValue ) =>
								setAttributes( { height: heightValue } )
							}
							min={ 1 }
							max={ 30 }
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						label={ __( 'Bar Position' ) }
						isShownByDefault
						hasValue={ () => position !== 'top' }
						onDeselect={ () =>
							setAttributes( { position: 'top' } )
						}
					>
						<CustomSelectControl
							__next40pxDefaultSize
							label={ __( 'Bar Position' ) }
							help={ __( 'Position of the bar' ) }
							value={ position }
							onChange={ ( positionValue ) => {
								setAttributes( {
									position: positionValue.selectedItem.key,
								} );
							} }
							options={ [
								{
									key: 'top',
									name: __( 'Top' ),
								},
								{
									key: 'bottom',
									name: __( 'Bottom' ),
								},
							] }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
				<PanelColorSettings
					title={ __( 'Color Settings' ) }
					colorSettings={ [
						{
							value: backgroundColor,
							onChange: ( bgColor ) =>
								setAttributes( { backgroundColor: bgColor } ),
							label: __( 'Background Color' ),
						},
						{
							value: progressColor,
							onChange: ( progressBarColor ) =>
								setAttributes( {
									progressColor: progressBarColor,
								} ),
							label: __( 'Progress Color' ),
						},
					] }
				/>
			</InspectorControls>
			<div className="wp-block-read-progress__container">
				<p className="wp-block-read-progress__selector">
					{ __( 'Reading Progress' ) }
				</p>
				<div
					style={ readProgressStyle }
					className="wp-block-read-progress__read-bar"
				>
					<div
						style={ progressStyle }
						className="wp-block-read-progress__progress-style"
					></div>
				</div>
			</div>
		</div>
	);
}
