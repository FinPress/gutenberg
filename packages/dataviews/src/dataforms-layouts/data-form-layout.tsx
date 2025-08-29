/**
 * WordPress dependencies
 */
import { __experimentalVStack as VStack } from '@wordpress/components';
import { useContext, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { Form, SimpleFormField, FormField, FieldValidity } from '../types';
import { getFormFieldLayout } from './index';
import DataFormContext from '../components/dataform-context';
import { isCombinedField } from './is-combined-field';
import normalizeFormFields from '../normalize-form-fields';

export function DataFormLayout< Item >( {
	data,
	form,
	onChange,
	children,
}: {
	data: Item;
	form: Form;
	onChange: ( value: any ) => void;
	children?: (
		FieldLayout: ( props: {
			data: Item;
			field: FormField;
			onChange: ( value: any ) => void;
			hideLabelFromVision?: boolean;
			validity?: FieldValidity;
		} ) => React.JSX.Element | null,
		field: FormField
	) => React.JSX.Element;
} ) {
	const { fields: fieldDefinitions, validity } =
		useContext( DataFormContext );

	function getFieldDefinition( field: SimpleFormField | string ) {
		const fieldId = typeof field === 'string' ? field : field.id;

		return fieldDefinitions.find(
			( fieldDefinition ) => fieldDefinition.id === fieldId
		);
	}

	const normalizedFormFields = useMemo(
		() => normalizeFormFields( form ),
		[ form ]
	);

	return (
		<VStack spacing={ form.layout?.type === 'panel' ? 2 : 4 }>
			{ normalizedFormFields.map( ( formField ) => {
				const FieldLayout = getFormFieldLayout( formField.layout.type )
					?.component;

				if ( ! FieldLayout ) {
					return null;
				}

				const fieldDefinition = ! isCombinedField( formField )
					? getFieldDefinition( formField )
					: undefined;

				if (
					fieldDefinition &&
					fieldDefinition.isVisible &&
					! fieldDefinition.isVisible( data )
				) {
					return null;
				}

				if ( children ) {
					return children(
						( props ) => (
							<FieldLayout
								{ ...props }
								validity={ validity?.find(
									( item ) => item.id === formField.id
								) }
							/>
						),
						formField
					);
				}

				const fieldValidity = validity?.find(
					( item ) => item.id === formField.id
				);
				return (
					<FieldLayout
						key={ formField.id }
						data={ data }
						field={ formField }
						onChange={ onChange }
						validity={ fieldValidity }
					/>
				);
			} ) }
		</VStack>
	);
}
