/**
 * WordPress dependencies
 */
import { useContext, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import DataFormContext from '../components/dataform-context';
import { MIXED_VALUE } from '../constants';

export default function useFieldValue< Item >(
	data: Item | Item[],
	fieldId: string
) {
	const { fields } = useContext( DataFormContext );
	return useMemo( () => {
		const fieldDefinition = fields.find(
			( fieldDef ) => fieldDef.id === fieldId
		);
		if ( ! fieldDefinition ) {
			return undefined;
		}
		if ( Array.isArray( data ) ) {
			const [ firstRecord, ...remainingRecords ] = data;
			const firstValue = fieldDefinition.getValue( {
				item: firstRecord,
			} );
			const intersects = remainingRecords.every( ( item ) => {
				return fieldDefinition.getValue( { item } ) === firstValue;
			} );
			return intersects ? firstValue : MIXED_VALUE;
		}
		return fieldDefinition.getValue( {
			item: data,
		} );
	}, [ data, fields, fieldId ] );
}
