/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';
import {
	getColorClassName,
	getFontSizeClass,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { compose } from '@wordpress/compose';
import { isRTL } from '@wordpress/i18n';

const supports = {
	className: false,
};

const blockAttributes = {
	align: {
		type: 'string',
	},
	content: {
		type: 'string',
		source: 'html',
		selector: 'p',
		default: '',
	},
	dropCap: {
		type: 'boolean',
		default: false,
	},
	placeholder: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	backgroundColor: {
		type: 'string',
	},
	fontSize: {
		type: 'string',
	},
	direction: {
		type: 'string',
		enum: [ 'ltr', 'rtl' ],
	},
	style: {
		type: 'object',
	},
};

const migrateCustomColorsAndFontSizes = ( attributes ) => {
	if (
		! attributes.customTextColor &&
		! attributes.customBackgroundColor &&
		! attributes.customFontSize
	) {
		return attributes;
	}
	const style = {};
	if ( attributes.customTextColor || attributes.customBackgroundColor ) {
		style.color = {};
	}
	if ( attributes.customTextColor ) {
		style.color.text = attributes.customTextColor;
	}
	if ( attributes.customBackgroundColor ) {
		style.color.background = attributes.customBackgroundColor;
	}
	if ( attributes.customFontSize ) {
		style.typography = { fontSize: attributes.customFontSize };
	}

	const {
		customTextColor,
		customBackgroundColor,
		customFontSize,
		...restAttributes
	} = attributes;

	return {
		...restAttributes,
		style,
	};
};

const TEXT_ALIGN_OPTIONS = [ 'left', 'right', 'center' ];

const migrateTextAlign = ( attributes ) => {
	const { align, style = {}, ...rest } = attributes;
	return TEXT_ALIGN_OPTIONS.includes( align )
		? {
				...rest,
				align: undefined,
				style: {
					...style,
					typography: {
						...style?.typography,
						textAlign: align,
					},
				},
		  }
		: attributes;
};

const { style, ...restBlockAttributes } = blockAttributes;

const v7 = {
	attributes: {
		align: {
			type: 'string',
		},
		content: {
			type: 'rich-text',
			source: 'rich-text',
			selector: 'p',
			role: 'content',
		},
		dropCap: {
			type: 'boolean',
			default: false,
		},
		placeholder: {
			type: 'string',
		},
		direction: {
			type: 'string',
			enum: [ 'ltr', 'rtl' ],
		},
	},
	supports: {
		splitting: true,
		align: true,
		className: false,
		__experimentalBorder: {
			color: true,
			radius: true,
			style: true,
			width: true,
		},
		color: {
			gradients: true,
			link: true,
			__experimentalDefaultControls: {
				background: true,
				text: true,
			},
		},
		spacing: {
			margin: true,
			padding: true,
			__experimentalDefaultControls: {
				margin: false,
				padding: false,
			},
		},
		typography: {
			fontSize: true,
			lineHeight: true,
			__experimentalFontFamily: true,
			__experimentalTextDecoration: true,
			__experimentalFontStyle: true,
			__experimentalFontWeight: true,
			__experimentalLetterSpacing: true,
			__experimentalTextTransform: true,
			__experimentalWritingMode: true,
			__experimentalDefaultControls: {
				fontSize: true,
			},
		},
		__experimentalSelector: 'p',
		__unstablePasteTextInline: true,
		interactivity: {
			clientNavigation: true,
		},
	},
	isEligible: ( { align } ) => TEXT_ALIGN_OPTIONS.includes( align ),
	migrate: migrateTextAlign,
	save( { attributes } ) {
		const { align, content, dropCap, direction } = attributes;
		const className = clsx( {
			'has-drop-cap':
				align === ( isRTL() ? 'left' : 'right' ) || align === 'center'
					? false
					: dropCap,
			[ `has-text-align-${ align }` ]: align,
		} );

		return (
			<p { ...useBlockProps.save( { className, dir: direction } ) }>
				<RichText.Content value={ content } />
			</p>
		);
	},
};

const deprecated = [
	v7,
	// Version without drop cap on aligned text.
	{
		supports,
		attributes: {
			...restBlockAttributes,
			customTextColor: {
				type: 'string',
			},
			customBackgroundColor: {
				type: 'string',
			},
			customFontSize: {
				type: 'number',
			},
		},
		migrate: compose( migrateCustomColorsAndFontSizes, migrateTextAlign ),
		save( { attributes } ) {
			const { align, content, dropCap, direction } = attributes;
			const className = clsx( {
				'has-drop-cap':
					align === ( isRTL() ? 'left' : 'right' ) ||
					align === 'center'
						? false
						: dropCap,
				[ `has-text-align-${ align }` ]: align,
			} );

			return (
				<p { ...useBlockProps.save( { className, dir: direction } ) }>
					<RichText.Content value={ content } />
				</p>
			);
		},
	},
	{
		supports,
		attributes: {
			...restBlockAttributes,
			customTextColor: {
				type: 'string',
			},
			customBackgroundColor: {
				type: 'string',
			},
			customFontSize: {
				type: 'number',
			},
		},
		migrate: compose( migrateCustomColorsAndFontSizes, migrateTextAlign ),
		save( { attributes } ) {
			const {
				align,
				content,
				dropCap,
				backgroundColor,
				textColor,
				customBackgroundColor,
				customTextColor,
				fontSize,
				customFontSize,
				direction,
			} = attributes;

			const textClass = getColorClassName( 'color', textColor );
			const backgroundClass = getColorClassName(
				'background-color',
				backgroundColor
			);
			const fontSizeClass = getFontSizeClass( fontSize );

			const className = clsx( {
				'has-text-color': textColor || customTextColor,
				'has-background': backgroundColor || customBackgroundColor,
				'has-drop-cap': dropCap,
				[ `has-text-align-${ align }` ]: align,
				[ fontSizeClass ]: fontSizeClass,
				[ textClass ]: textClass,
				[ backgroundClass ]: backgroundClass,
			} );

			const styles = {
				backgroundColor: backgroundClass
					? undefined
					: customBackgroundColor,
				color: textClass ? undefined : customTextColor,
				fontSize: fontSizeClass ? undefined : customFontSize,
			};

			return (
				<RichText.Content
					tagName="p"
					style={ styles }
					className={ className ? className : undefined }
					value={ content }
					dir={ direction }
				/>
			);
		},
	},
	{
		supports,
		attributes: {
			...restBlockAttributes,
			customTextColor: {
				type: 'string',
			},
			customBackgroundColor: {
				type: 'string',
			},
			customFontSize: {
				type: 'number',
			},
		},
		migrate: compose( migrateCustomColorsAndFontSizes, migrateTextAlign ),
		save( { attributes } ) {
			const {
				align,
				content,
				dropCap,
				backgroundColor,
				textColor,
				customBackgroundColor,
				customTextColor,
				fontSize,
				customFontSize,
				direction,
			} = attributes;

			const textClass = getColorClassName( 'color', textColor );
			const backgroundClass = getColorClassName(
				'background-color',
				backgroundColor
			);
			const fontSizeClass = getFontSizeClass( fontSize );

			const className = clsx( {
				'has-text-color': textColor || customTextColor,
				'has-background': backgroundColor || customBackgroundColor,
				'has-drop-cap': dropCap,
				[ fontSizeClass ]: fontSizeClass,
				[ textClass ]: textClass,
				[ backgroundClass ]: backgroundClass,
			} );

			const styles = {
				backgroundColor: backgroundClass
					? undefined
					: customBackgroundColor,
				color: textClass ? undefined : customTextColor,
				fontSize: fontSizeClass ? undefined : customFontSize,
				textAlign: align,
			};

			return (
				<RichText.Content
					tagName="p"
					style={ styles }
					className={ className ? className : undefined }
					value={ content }
					dir={ direction }
				/>
			);
		},
	},
	{
		supports,
		attributes: {
			...restBlockAttributes,
			customTextColor: {
				type: 'string',
			},
			customBackgroundColor: {
				type: 'string',
			},
			customFontSize: {
				type: 'number',
			},
			width: {
				type: 'string',
			},
		},
		migrate: compose( migrateCustomColorsAndFontSizes, migrateTextAlign ),
		save( { attributes } ) {
			const {
				width,
				align,
				content,
				dropCap,
				backgroundColor,
				textColor,
				customBackgroundColor,
				customTextColor,
				fontSize,
				customFontSize,
			} = attributes;

			const textClass = getColorClassName( 'color', textColor );
			const backgroundClass = getColorClassName(
				'background-color',
				backgroundColor
			);
			const fontSizeClass = fontSize && `is-${ fontSize }-text`;

			const className = clsx( {
				[ `align${ width }` ]: width,
				'has-background': backgroundColor || customBackgroundColor,
				'has-drop-cap': dropCap,
				[ fontSizeClass ]: fontSizeClass,
				[ textClass ]: textClass,
				[ backgroundClass ]: backgroundClass,
			} );

			const styles = {
				backgroundColor: backgroundClass
					? undefined
					: customBackgroundColor,
				color: textClass ? undefined : customTextColor,
				fontSize: fontSizeClass ? undefined : customFontSize,
				textAlign: align,
			};

			return (
				<RichText.Content
					tagName="p"
					style={ styles }
					className={ className ? className : undefined }
					value={ content }
				/>
			);
		},
	},
	{
		supports,
		attributes: {
			...restBlockAttributes,
			fontSize: {
				type: 'number',
			},
		},
		save( { attributes } ) {
			const {
				width,
				align,
				content,
				dropCap,
				backgroundColor,
				textColor,
				fontSize,
			} = attributes;
			const className = clsx( {
				[ `align${ width }` ]: width,
				'has-background': backgroundColor,
				'has-drop-cap': dropCap,
			} );
			const styles = {
				backgroundColor,
				color: textColor,
				fontSize,
				textAlign: align,
			};

			return (
				<p
					style={ styles }
					className={ className ? className : undefined }
				>
					{ content }
				</p>
			);
		},
		migrate( attributes ) {
			return migrateCustomColorsAndFontSizes( {
				...migrateTextAlign( attributes ),
				customFontSize: Number.isFinite( attributes.fontSize )
					? attributes.fontSize
					: undefined,
				customTextColor:
					attributes.textColor && '#' === attributes.textColor[ 0 ]
						? attributes.textColor
						: undefined,
				customBackgroundColor:
					attributes.backgroundColor &&
					'#' === attributes.backgroundColor[ 0 ]
						? attributes.backgroundColor
						: undefined,
			} );
		},
	},
	{
		supports,
		attributes: {
			...blockAttributes,
			content: {
				type: 'string',
				source: 'html',
				default: '',
			},
		},
		save( { attributes } ) {
			return <RawHTML>{ attributes.content }</RawHTML>;
		},
		migrate: compose( migrateCustomColorsAndFontSizes, migrateTextAlign ),
	},
];

export default deprecated;
