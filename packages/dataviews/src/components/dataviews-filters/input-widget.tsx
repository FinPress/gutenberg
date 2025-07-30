/**
 * External dependencies
 */
import fastDeepEqual from 'fast-deep-equal/es6';

/**
 * WordPress dependencies
 */
import { useEvent } from '@wordpress/compose';
import { useMemo } from '@wordpress/element';
import { Flex } from '@wordpress/components';

/**
 * Internal dependencies
 */
import type { View, NormalizedFilter, NormalizedField } from '../../types';
import { getCurrentValue } from './utils';

interface UserInputWidgetProps {
    view: View;
    filter: NormalizedFilter;
    onChangeView: ( view: View ) => void;
    fields: NormalizedField< any >[];
}

export default function InputWidget( {
    filter,
    view,
    onChangeView,
    fields,
}: UserInputWidgetProps ) {
    const currentFilter = view.filters?.find(
        ( f ) => f.field === filter.field
    );

    const field = fields.find( ( f ) => f.id === filter.field );
    const currentValue = getCurrentValue( filter, currentFilter );

    // Build a fake item using setValue if available, otherwise fallback to {[field.id]: value}
    const data = useMemo( () => {
        let item = {};
        for ( const f of view.filters ?? [] ) {
            const fieldDef = fields.find( fld => fld.id === f.field );
            if (fieldDef && typeof fieldDef.setValue === 'function') {
                item = fieldDef.setValue({ item, value: f.value });
            } else {
                item = { ...item, [f.field]: f.value };
            }
        }
        return item;
    }, [ view.filters, fields ] );

    const handleChange = useEvent( ( updatedData: Record< string, any > ) => {
        if ( !field || !currentFilter ) {
            return;
        }
        // Use setValue to extract the new value for this field
        let nextValue;
        if (typeof field.setValue === 'function') {
            // Simulate updating only this field in the item
            const fakeItem = field.setValue({ item: data, value: updatedData[field.id] });
            nextValue = field.getValue({ item: fakeItem });
        } else {
            nextValue = updatedData[field.id];
        }
        if ( fastDeepEqual( nextValue, currentValue ) ) {
            return;
        }
        onChangeView( {
            ...view,
            filters: ( view.filters ?? [] ).map( ( _filter ) =>
                _filter.field === filter.field
                    ? {
                            ..._filter,
                            operator:
                                currentFilter.operator || filter.operators[ 0 ],
                            // Consider empty strings as undefined:
                            //
                            // - undefined as value means the filter is unset: the filter widget displays no value and the search returns all records
                            // - empty string as value means "search empty string": returns only the records that have an empty string as value
                            //
                            // In practice, this means the filter will not be able to find an empty string as the value.
                            value: nextValue === '' ? undefined : nextValue,
                      }
                    : _filter
            ),
        } );
    });

    if ( ! field || ! field.Edit || ! currentFilter ) {
        return null;
    }

    return (
        <Flex
            className="dataviews-filters__user-input-widget"
            gap={ 2.5 }
            direction="column"
        >
            <field.Edit
                hideLabelFromVision
                data={ data }
                field={ field }
                operator={ currentFilter.operator }
                onChange={ handleChange }
            />
        </Flex>
    );
}