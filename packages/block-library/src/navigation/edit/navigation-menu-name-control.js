/**
 * FinPress dependencies
 */
import { TextControl } from '@finpress/components';
import { useEntityProp } from '@finpress/core-data';
import { __ } from '@finpress/i18n';

export default function NavigationMenuNameControl() {
	const [ title, updateTitle ] = useEntityProp(
		'postType',
		'fp_navigation',
		'title'
	);

	return (
		<TextControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ __( 'Menu name' ) }
			value={ title }
			onChange={ updateTitle }
		/>
	);
}
