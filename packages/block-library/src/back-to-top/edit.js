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

const ICON_OPTIONS = [
	{ label: __( 'Arrow Up Alt' ), value: 'arrow-up-alt' },
	{ label: __( 'Arrow Up Alt 2' ), value: 'arrow-up-alt2' },
	{ label: __( 'Caret Up' ), value: 'arrow-up' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		content,
		buttonPosition = 'right',
		scrollOffset,
		scrollDuration,
		smoothScroll,
		hasIcon,
		iconName,
		iconPosition,
		showText,
	} = attributes;

	// Calculate position based on buttonPosition
	const getPositionStyles = () => {
		switch ( buttonPosition ) {
			case 'left':
				return { left: '20px' };
			case 'center':
				return { left: '50%', transform: 'translateX(-50%)' };
			case 'right':
			default:
				return { right: '20px' };
		}
	};

	const blockProps = useBlockProps( {
		className: `wp-block-back-to-top-editor`,
		style: {
			position: 'fixed',
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			minWidth: '40px',
			bottom: '20px',
			gap: '0.5em',
			cursor: 'pointer',
			border: 'none',
			...getPositionStyles(),
		},
	} );

	const handleClick = ( e ) => {
		e.preventDefault();
		const editorIframe = document.querySelector(
			'iframe[name="editor-canvas"]'
		);
		const editorContainer = document.querySelector(
			'.interface-interface-skeleton__content'
		);

		if ( editorIframe?.contentWindow ) {
			editorIframe.contentWindow.scrollTo( {
				top: 0,
				behavior: smoothScroll ? 'smooth' : 'auto',
			} );
		}

		if ( editorContainer ) {
			editorContainer.scrollTo( {
				top: 0,
				behavior: smoothScroll ? 'smooth' : 'auto',
			} );
		}
	};

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
				{ /* Button Settings */ }
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

				{ /* Scroll Settings */ }
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

				{ /* Icon Settings */ }
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
								options={ ICON_OPTIONS }
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
			</InspectorControls>
		</>
	);
}
