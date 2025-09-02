/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BaseControl,
	ColorPicker,
	RangeControl,
	Flex,
	Button,
	Popover,
	CheckboxControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import deprecated from '@wordpress/deprecated';
import { withInstanceId } from '@wordpress/compose';

export default function TextShadowControl( {
	/** Start opting into the larger default height that will become the default size in a future version. */
	__next40pxDefaultSize = false,
	/** Start opting into the new margin-free styles that will become the default in a future version. */
	__nextHasNoMarginBottom = false,
	value = '',
	onChange,
	className,
	...props
} ) {
	const [ isPickerOpen, setIsPickerOpen ] = useState( false );
	const [ previousShadow, setPreviousShadow ] = useState(
		'2px 2px 4px #000000'
	);

	if ( ! __nextHasNoMarginBottom ) {
		deprecated(
			'Bottom margin styles for wp.blockEditor.TextShadowControl',
			{
				since: '6.8.3',
				version: '7.0',
				hint: 'Set the `__nextHasNoMarginBottom` prop to true to start opting into the new styles, which will become the default in a future version',
			}
		);
	}

	if (
		! __next40pxDefaultSize &&
		( props.size === undefined || props.size === 'default' )
	) {
		deprecated(
			`36px default size for wp.blockEditor.__experimentalTextShadowControl`,
			{
				since: '6.8.3',
				version: '7.1',
				hint: 'Set the `__next40pxDefaultSize` prop to true to start opting into the new default size, which will become the default in a future version.',
			}
		);
	}

	// Parse text-shadow value
	const parseTextShadow = ( textShadowValue ) => {
		if ( ! textShadowValue || textShadowValue === 'none' ) {
			return {
				offsetX: 0,
				offsetY: 0,
				blurRadius: 0,
				color: '#000000',
			};
		}

		// Basic parsing for text-shadow values like "Xpx Ypx Zpx #COLOR"
		const parts = textShadowValue.trim().split( /\s+/ );
		const offsetX = parseInt( parts[ 0 ] ) || 0;
		const offsetY = parseInt( parts[ 1 ] ) || 0;
		const blurRadius = parseInt( parts[ 2 ] ) || 0;
		const color = parts[ 3 ] || '#000000';

		return { offsetX, offsetY, blurRadius, color };
	};

	// Convert shadow object back to CSS string
	const formatTextShadow = ( shadow ) => {
		const { offsetX, offsetY, blurRadius, color } = shadow;
		if ( offsetX === 0 && offsetY === 0 && blurRadius === 0 ) {
			return 'none';
		}
		return `${ offsetX }px ${ offsetY }px ${ blurRadius }px ${ color }`;
	};

	const currentShadow = parseTextShadow( value );

	const updateShadow = ( property, newValue ) => {
		const updatedShadow = {
			...currentShadow,
			[ property ]: newValue,
		};
		onChange( formatTextShadow( updatedShadow ) );
	};

	const resetShadow = () => {
		setPreviousShadow( value && value !== 'none' ? value : previousShadow );
		onChange( 'none' );
	};

	const enableShadow = () => {
		onChange( previousShadow );
	};

	const hasTextShadow = value && value !== 'none';

	return (
		<BaseControl
			label={ __( 'Text shadow' ) }
			id={ withInstanceId( 'text-shadow-control' ) }
			className={ clsx( 'block-editor-text-shadow-control', className, {
				'is-next-has-no-margin-bottom': __nextHasNoMarginBottom,
			} ) }
			__nextHasNoMarginBottom={ __nextHasNoMarginBottom }
			{ ...props }
		>
			<Flex direction="column" gap={ 3 }>
				<CheckboxControl
					label={ __( 'Enable text shadow' ) }
					checked={ hasTextShadow }
					onChange={ ( isChecked ) => {
						if ( isChecked ) {
							enableShadow();
						} else {
							resetShadow();
						}
					} }
					__nextHasNoMarginBottom={ __nextHasNoMarginBottom }
				/>

				{ hasTextShadow && (
					<>
						<RangeControl
							label={ __( 'Horizontal offset' ) }
							value={ currentShadow.offsetX }
							onChange={ ( newValue ) =>
								updateShadow( 'offsetX', newValue )
							}
							min={ -20 }
							max={ 20 }
							step={ 1 }
							allowReset
							resetFallbackValue={ 0 }
							__next40pxDefaultSize={ __next40pxDefaultSize }
							__nextHasNoMarginBottom={ __nextHasNoMarginBottom }
						/>

						<RangeControl
							label={ __( 'Vertical offset' ) }
							value={ currentShadow.offsetY }
							onChange={ ( newValue ) =>
								updateShadow( 'offsetY', newValue )
							}
							min={ -20 }
							max={ 20 }
							step={ 1 }
							allowReset
							resetFallbackValue={ 0 }
							__next40pxDefaultSize={ __next40pxDefaultSize }
							__nextHasNoMarginBottom={ __nextHasNoMarginBottom }
						/>

						<RangeControl
							label={ __( 'Blur radius' ) }
							value={ currentShadow.blurRadius }
							onChange={ ( newValue ) =>
								updateShadow( 'blurRadius', newValue )
							}
							min={ 0 }
							max={ 20 }
							step={ 1 }
							allowReset
							resetFallbackValue={ 0 }
							__next40pxDefaultSize={ __next40pxDefaultSize }
							__nextHasNoMarginBottom={ __nextHasNoMarginBottom }
						/>

						<BaseControl
							label={ __( 'Shadow color' ) }
							__nextHasNoMarginBottom={ __nextHasNoMarginBottom }
							id={ withInstanceId( 'text-shadow-color' ) }
						>
							<Flex align="center" gap={ 2 }>
								<Button
									style={ {
										backgroundColor: currentShadow.color,
										width: '32px',
										height: '32px',
										border: '1px solid #ccc',
										borderRadius: '4px',
										cursor: 'pointer',
									} }
									onClick={ () =>
										setIsPickerOpen( ! isPickerOpen )
									}
									aria-label={ __( 'Choose shadow color' ) }
									id={ withInstanceId(
										'text-shadow-color-button'
									) }
									__nextHasNoMarginBottom={
										__nextHasNoMarginBottom
									}
									__next40pxDefaultSize={
										__next40pxDefaultSize
									}
								/>
								<span>{ currentShadow.color }</span>
							</Flex>

							{ isPickerOpen && (
								<Popover
									onClose={ () => setIsPickerOpen( false ) }
									placement="left-start"
								>
									<ColorPicker
										color={ currentShadow.color }
										onChange={ ( color ) =>
											updateShadow( 'color', color )
										}
										enableAlpha
									/>
								</Popover>
							) }
						</BaseControl>
					</>
				) }
			</Flex>
		</BaseControl>
	);
}
