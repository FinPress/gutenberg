/**
 * WordPress dependencies
 */
import { dateI18n, getDate, getSettings } from '@wordpress/date';

/**
 * Internal dependencies
 */
import type {
	DataViewRenderFieldProps,
	SortDirection,
	ValidationContext,
	FieldTypeDefinition,
} from '../types';
import { renderFromElements } from '../utils';
import {
	OPERATOR_ON,
	OPERATOR_NOT_ON,
	OPERATOR_BEFORE,
	OPERATOR_AFTER,
	OPERATOR_BEFORE_INC,
	OPERATOR_AFTER_INC,
	OPERATOR_IN_THE_PAST,
	OPERATOR_OVER,
	OPERATOR_BETWEEN,
} from '../constants';

const getFormattedDate = ( dateToDisplay: string | null ) =>
	dateI18n( getSettings().formats.date, getDate( dateToDisplay ) );

function sort( a: any, b: any, direction: SortDirection ) {
	const timeA = new Date( a ).getTime();
	const timeB = new Date( b ).getTime();

	return direction === 'asc' ? timeA - timeB : timeB - timeA;
}

function isValid( value: any, context?: ValidationContext ) {
	if ( context?.elements ) {
		const validValues = context?.elements.map( ( f ) => f.value );
		if ( ! validValues.includes( value ) ) {
			return false;
		}
	}

	return true;
}

export default {
	sort,
	isValid,
	Edit: 'date',
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
	filterBy: {
		defaultOperators: [
			OPERATOR_ON,
			OPERATOR_NOT_ON,
			OPERATOR_BEFORE,
			OPERATOR_AFTER,
			OPERATOR_BEFORE_INC,
			OPERATOR_AFTER_INC,
			OPERATOR_IN_THE_PAST,
			OPERATOR_OVER,
			OPERATOR_BETWEEN,
		],
		validOperators: [
			OPERATOR_ON,
			OPERATOR_NOT_ON,
			OPERATOR_BEFORE,
			OPERATOR_AFTER,
			OPERATOR_BEFORE_INC,
			OPERATOR_AFTER_INC,
			OPERATOR_IN_THE_PAST,
			OPERATOR_OVER,
			OPERATOR_BETWEEN,
		],
	},
} satisfies FieldTypeDefinition< any >;
