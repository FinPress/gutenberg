/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { ToggleControl } from '@finpress/components';

export function QueryPaginationLabelControl( { value, onChange } ) {
	return (
		<ToggleControl
			__nextHasNoMarginBottom
			label={ __( 'Show label text' ) }
			help={ __( 'Make label text visible, e.g. "Next Page".' ) }
			onChange={ onChange }
			checked={ value === true }
		/>
	);
}
