/**
 * WordPress dependencies
 */
import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import DataViewsContext from '../dataviews-context';

export default function PreviewOnlyToggle() {
	const context = useContext( DataViewsContext );
	const { view, onChangeView } = context;
	const previewOnlyEnabled = view.previewOnlyEnabled ?? false;

	// Preview Only mode is only available in the grid layout.
	if ( view.type !== 'grid' ) {
		return null;
	}

	return (
		<ToggleControl
			__nextHasNoMarginBottom
			label={ __( 'Preview only' ) }
			help={ __( 'Hide all properties except for the preview.' ) }
			checked={ previewOnlyEnabled }
			onChange={ ( newValue ) => {
				onChangeView( {
					...view,
					previewOnlyEnabled: newValue,
				} );
			} }
		/>
	);
}
