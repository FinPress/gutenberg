/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type {
	FieldLayoutProps,
	Form,
	NormalizedRowLayout,
	SimpleFormField,
} from '../../types';
import DataFormContext from '../../components/dataform-context';
import { DataFormLayout } from '../data-form-layout';
import { isCombinedField } from '../is-combined-field';
import { normalizeLayout } from '../../normalize-form-fields';

export default function FormRowField< Item >( {
	data,
	field,
	onChange,
	hideLabelFromVision,
}: FieldLayoutProps< Item > ) {
	const { fields } = useContext( DataFormContext );

	const layout = normalizeLayout( {
		...field.layout,
		type: 'row',
	} ) as NormalizedRowLayout;

	// If it's a combined field, delegate to DataFormLayout with a row container.
	if ( isCombinedField( field ) ) {
		const form = {
			fields: field.children.map( ( child ) => {
				if ( typeof child === 'string' ) {
					return { id: child } as SimpleFormField;
				}
				return child;
			} ),
			layout,
		} as Form;

		return (
			<DataFormLayout data={ data } form={ form } onChange={ onChange }>
				{ ( FieldLayout, nestedField ) => (
					<div
						key={ nestedField.id }
						className="dataforms-layouts-row__field-item"
					>
						<FieldLayout
							data={ data }
							field={ nestedField }
							onChange={ onChange }
							hideLabelFromVision={ hideLabelFromVision }
						/>
					</div>
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
		<div className="dataforms-layouts-row__field-item">
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
		</div>
	);
}
