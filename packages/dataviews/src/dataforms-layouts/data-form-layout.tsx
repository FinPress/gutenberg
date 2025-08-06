/**
 * WordPress dependencies
 */
import { __experimentalVStack as VStack } from '@wordpress/components';
import { useContext, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import DataFormContext from '../components/dataform-context';
import normalizeFormFields from '../normalize-form-fields';
import type { Form, FormField, SimpleFormField } from '../types';
import { getFormFieldLayout } from './index';
import { isCombinedField } from './is-combined-field';

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
		} ) => React.JSX.Element | null,
		field: FormField
	) => React.JSX.Element;
} ) {
	const { fields: fieldDefinitions } = useContext( DataFormContext );

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
		<VStack spacing={ form?.type === 'panel' ? 2 : 4 }>
			{ normalizedFormFields.map( ( formField ) => {
				const FieldLayout = getFormFieldLayout( formField.layout )
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

				const customStyle = formField.customStyle ?? form.customStyle;

				if ( children ) {
					// @ts-expect-error
					return children( FieldLayout, {
						...formField,
						customStyle,
					} );
				}

				return (
					<FieldLayout
						customStyle={ formField.customStyle }
						key={ formField.id }
						data={ data }
						field={ formField }
						onChange={ onChange }
					/>
				);
			} ) }
		</VStack>
	);
}
