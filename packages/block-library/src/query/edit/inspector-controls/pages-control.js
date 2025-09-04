/**
 * FinPress dependencies
 */
import { __experimentalNumberControl as NumberControl } from '@finpress/components';
import { __ } from '@finpress/i18n';

export const PagesControl = ( { pages, onChange } ) => {
	return (
		<NumberControl
			__next40pxDefaultSize
			label={ __( 'Max pages to show' ) }
			value={ pages }
			min={ 0 }
			onChange={ ( newPages ) => {
				if ( isNaN( newPages ) || newPages < 0 ) {
					return;
				}
				onChange( { pages: newPages } );
			} }
			help={ __(
				'Limit the pages you want to show, even if the query has more results. To show all pages use 0 (zero).'
			) }
		/>
	);
};

export default PagesControl;
