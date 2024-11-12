/**
 * WordPress dependencies
 */
import { TextControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

export default function NavigationMenuNameControl( {
	attributes,
	setAttributes,
} ) {
	const [ title, updateTitle ] = useEntityProp(
		'postType',
		'wp_navigation',
		'title'
	);

	const { ariaLabel } = attributes;

	return (
		<>
			<TextControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Menu name' ) }
				value={ title }
				onChange={ updateTitle }
			/>
			<TextControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Aria label' ) }
				value={ ariaLabel }
				onChange={ ( newAriaLabel ) => {
					setAttributes( {
						ariaLabel: newAriaLabel,
					} );
				} }
			/>
		</>
	);
}
