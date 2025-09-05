/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { RichText, useBlockProps } from '@finpress/block-editor';
import { __ } from '@finpress/i18n';
import { useSelect } from '@finpress/data';
import { store as coreStore } from '@finpress/core-data';

const preventDefault = ( event ) => event.preventDefault();

export default function HomeEdit( { attributes, setAttributes, context } ) {
	const homeUrl = useSelect( ( select ) => {
		// Site index.
		return select( coreStore ).getEntityRecord( 'root', '__unstableBase' )
			?.home;
	}, [] );

	const { textColor, backgroundColor, style } = context;
	const blockProps = useBlockProps( {
		className: clsx( 'fp-block-navigation-item', {
			'has-text-color': !! textColor || !! style?.color?.text,
			[ `has-${ textColor }-color` ]: !! textColor,
			'has-background': !! backgroundColor || !! style?.color?.background,
			[ `has-${ backgroundColor }-background-color` ]: !! backgroundColor,
		} ),
		style: {
			color: style?.color?.text,
			backgroundColor: style?.color?.background,
		},
	} );

	return (
		<div { ...blockProps }>
			<a
				className="fp-block-home-link__content fp-block-navigation-item__content"
				href={ homeUrl }
				onClick={ preventDefault }
			>
				<RichText
					identifier="label"
					className="fp-block-home-link__label"
					value={ attributes.label ?? __( 'Home' ) }
					onChange={ ( labelValue ) => {
						setAttributes( { label: labelValue } );
					} }
					aria-label={ __( 'Home link text' ) }
					placeholder={ __( 'Add home link' ) }
					withoutInteractiveFormatting
				/>
			</a>
		</div>
	);
}
