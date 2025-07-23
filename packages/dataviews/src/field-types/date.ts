/**
 * WordPress dependencies
 */
import { dateI18n, getDate, getSettings } from '@wordpress/date';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type {
	DataViewRenderFieldProps,
	SortDirection,
	NormalizedField,
	FieldTypeDefinition,
} from '../types';
import { renderFromElements } from '../utils';

const getFormattedDate = ( dateToDisplay: string | null ) =>
	dateI18n( getSettings().formats.date, getDate( dateToDisplay ) );

function sort( a: any, b: any, direction: SortDirection ) {
	const timeA = new Date( a ).getTime();
	const timeB = new Date( b ).getTime();

	return direction === 'asc' ? timeA - timeB : timeB - timeA;
}

export default {
	sort,
	isValid: {
		custom: ( item: any, field: NormalizedField< any > ) => {
			const value = field.getValue( { item } );
			if ( field?.elements ) {
				const validValues = field.elements.map( ( f ) => f.value );
				if ( ! validValues.includes( value ) ) {
					return __( 'Value must be one of the elements.' );
				}
			}

			return null;
		},
	},
	Edit: null,
	render: ( { item, field }: DataViewRenderFieldProps< any > ) => {
		if ( field.elements ) {
			return renderFromElements( { item, field } );
		}

		const value = field.getValue( { item } );
		if ( ! value ) {
			return '';
		}

		return getFormattedDate( value );
	},
	enableSorting: true,
	filterBy: false,
} satisfies FieldTypeDefinition< any >;
