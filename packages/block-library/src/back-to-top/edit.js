/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	TextControl,
	Dashicon,
} from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const {
		content,
		buttonPosition,
		scrollOffset,
		scrollDuration,
		smoothScroll,
		hasIcon,
		iconName,
		iconPosition,
		showText,
		borderRadius,
		padding,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-back-to-top-editor align-${ buttonPosition }`,
		style: {
			borderRadius: `${ borderRadius }px`,
			padding: `${ padding }px`,
		},
	} );

	const handleClick = ( e ) => {
		e.preventDefault();

		// Find the editor iframe
		const editorIframe = document.querySelector(
			'iframe[name="editor-canvas"]'
		);

		if ( editorIframe && editorIframe.contentWindow ) {
			// Scroll the iframe content window
			editorIframe.contentWindow.scrollTo( {
				top: 0,
				behavior: smoothScroll ? 'smooth' : 'auto',
			} );

			// Also scroll the main editor container for better UX
			const editorContainer = document.querySelector(
				'.interface-interface-skeleton__content'
			);
			if ( editorContainer ) {
				editorContainer.scrollTo( {
					top: 0,
					behavior: smoothScroll ? 'smooth' : 'auto',
				} );
			}
		}
	};

	// Available dashicons for the button
	const iconOptions = [
		{ label: __( 'Arrow Up Alt' ), value: 'arrow-up-alt' },
		{ label: __( 'Arrow Up Alt 2' ), value: 'arrow-up-alt2' },
		{ label: __( 'Caret Up' ), value: 'arrow-up' },
	];

	const buttonContent = (
		<>
			{ hasIcon && iconPosition === 'before' && (
				<Dashicon icon={ iconName } />
			) }
			{ showText && (
				<span className="wp-block-back-to-top-text">{ content }</span>
			) }
			{ hasIcon && iconPosition === 'after' && (
				<Dashicon icon={ iconName } />
			) }
		</>
	);

	return (
		<>
			<button { ...blockProps } onClick={ handleClick }>
				{ buttonContent }
			</button>

			<InspectorControls>
				<PanelBody title={ __( 'Button Settings' ) }>
					<TextControl
						label={ __( 'Button Text' ) }
						value={ content }
						onChange={ ( value ) =>
							setAttributes( { content: value } )
						 }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={ __( 'Button Position' ) }
						value={ buttonPosition }
						options={ [
							{ label: __( 'Left' ), value: 'left' },
							{ label: __( 'Center' ), value: 'center' },
							{ label: __( 'Right' ), value: 'right' },
						] }
						onChange={ ( value ) =>
							setAttributes( { buttonPosition: value } )
						 }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={ __( 'Scroll Settings' ) }>
					<RangeControl
						label={ __( 'Scroll Offset' ) }
						value={ scrollOffset }
						onChange={ ( value ) =>
							setAttributes( { scrollOffset: value } )
						 }
						min={ 100 }
						max={ 1000 }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={ __( 'Scroll Duration' ) }
						value={ scrollDuration }
						onChange={ ( value ) =>
							setAttributes( { scrollDuration: value } )
						 }
						min={ 100 }
						max={ 2000 }
						step={ 100 }
						__next40pxDefaultSize
                        __nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Smooth Scrolling' ) }
						checked={ smoothScroll }
						onChange={ () =>
							setAttributes( { smoothScroll: ! smoothScroll } )
						}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={ __( 'Icon Settings' ) }>
					<ToggleControl
						label={ __( 'Show Icon' ) }
						checked={ hasIcon }
						onChange={ () =>
							setAttributes( { hasIcon: ! hasIcon } )
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Show Text' ) }
						checked={ showText }
						onChange={ () =>
							setAttributes( { showText: ! showText } )
						}
						__nextHasNoMarginBottom
					/>
					{ hasIcon && (
						<>
							<SelectControl
								label={ __( 'Icon' ) }
								value={ iconName }
								options={ iconOptions }
								onChange={ ( value ) =>
									setAttributes( { iconName: value } )
								}
								__next40pxDefaultSize
                                __nextHasNoMarginBottom
							/>
							{ showText && (
								<SelectControl
									label={ __( 'Icon Position' ) }
									value={ iconPosition }
									options={ [
										{
											label: __( 'Before Text' ),
											value: 'before',
										},
										{
											label: __( 'After Text' ),
											value: 'after',
										},
									] }
									onChange={ ( value ) =>
										setAttributes( { iconPosition: value } )
									}
									__next40pxDefaultSize
									__nextHasNoMarginBottom
								/>
							) }
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Style Settings' ) }>
					<RangeControl
						label={ __( 'Border Radius' ) }
						value={ borderRadius }
						onChange={ ( value ) =>
							setAttributes( { borderRadius: value } )
						}
						min={ 0 }
						max={ 50 }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={ __( 'Padding' ) }
						value={ padding }
						onChange={ ( value ) =>
							setAttributes( { padding: value } )
						}
						min={ 0 }
						max={ 50 }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
