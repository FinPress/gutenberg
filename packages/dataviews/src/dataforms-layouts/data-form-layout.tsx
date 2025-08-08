/**
 * WordPress dependencies
 */
import {
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { useContext, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { Form, FormField, SimpleFormField } from '../types';
import { getFormFieldLayout } from './index';
import DataFormContext from '../components/dataform-context';
import { isCombinedField } from './is-combined-field';
import normalizeFormFields from '../normalize-form-fields';

type StackDirection = 'vertical' | 'horizontal';

export interface DataFormLayoutProps< Item > {
	data: Item;
	form: Form;
	onChange: ( value: any ) => void;
	direction?: StackDirection;
	children?: (
		FieldLayout: ( props: {
			data: Item;
			field: FormField;
			onChange: ( value: any ) => void;
			hideLabelFromVision?: boolean;
		} ) => React.JSX.Element | null,
		field: FormField
	) => React.JSX.Element;
}

export function DataFormLayout< Item >( {
	data,
	form,
	onChange,
	direction = 'vertical',
	children,
}: DataFormLayoutProps< Item > ) {
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

	const Stack = direction === 'vertical' ? VStack : HStack;

	return (
		<Stack spacing={ form?.type === 'panel' ? 2 : 4 }>
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

				if ( children ) {
					return children( FieldLayout, formField );
				}

				return (
					<FieldLayout
						key={ formField.id }
						data={ data }
						field={ formField }
						onChange={ onChange }
					/>
				);
			} ) }
		</Stack>
	);
}
