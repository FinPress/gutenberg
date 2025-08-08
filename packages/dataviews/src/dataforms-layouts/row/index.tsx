/**
 * WordPress dependencies
 */
import { __experimentalVStack as VStack } from '@wordpress/components';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { FieldLayoutProps, Form, SimpleFormField } from '../../types';
import DataFormContext from '../../components/dataform-context';
import { DataFormLayout } from '../data-form-layout';
import { isCombinedField } from '../is-combined-field';

export default function FormRowField< Item >( {
	data,
	field,
	onChange,
	hideLabelFromVision,
}: FieldLayoutProps< Item > ) {
	const { fields } = useContext( DataFormContext );

	// If it's a combined field, delegate to DataFormLayout with a row container.
	if ( isCombinedField( field ) ) {
		const form = {
			fields: field.children.map( ( child ) => {
				if ( typeof child === 'string' ) {
					return { id: child } as SimpleFormField;
				}
				return child;
			} ),
			layout: {
				type: 'row',
			},
		} as Form;

		return (
			<DataFormLayout data={ data } form={ form } onChange={ onChange }>
				{ ( FieldLayout, nestedField ) => (
					<VStack
						key={ nestedField.id }
						className="dataforms-layouts-row__field-item"
						spacing={ 1 }
						style={ { flex: 1, minWidth: 0 } }
					>
						<FieldLayout
							data={ data }
							field={ nestedField }
							onChange={ onChange }
							hideLabelFromVision={ hideLabelFromVision }
						/>
					</VStack>
				) }
			</DataFormLayout>
		);
	}

	// Simple field: render directly without nesting another DataFormLayout.
	const fieldDefinition = fields.find( ( f ) => f.id === field.id );

	if ( ! fieldDefinition || ! fieldDefinition.Edit ) {
		return null;
	}

	return (
		<VStack
			className="dataforms-layouts-row__field-item"
			spacing={ 1 }
			style={ { flex: 1, minWidth: 0 } }
		>
			{ fieldDefinition.readOnly === true ? (
				<fieldDefinition.render
					item={ data }
					field={ fieldDefinition }
				/>
			) : (
				<fieldDefinition.Edit
					data={ data }
					field={ fieldDefinition }
					onChange={ onChange }
					hideLabelFromVision={ hideLabelFromVision }
				/>
			) }
		</VStack>
	);
}
