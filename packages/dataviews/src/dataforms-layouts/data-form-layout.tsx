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
import type {
	Form,
	FormField,
	Layout,
	NormalizedRowLayout,
	SimpleFormField,
} from '../types';
import { getFormFieldLayout } from './index';
import DataFormContext from '../components/dataform-context';
import { isCombinedField } from './is-combined-field';
import normalizeFormFields, { normalizeLayout } from '../normalize-form-fields';

const getContainer = ( disableWrapper = false, layout: Layout | undefined ) => {
	if ( disableWrapper ) {
		return {
			Component: ( { children }: { children: React.ReactNode } ) => (
				<>{ children }</>
			),
		};
	}

	if ( layout?.type === 'row' ) {
		const normalizedLayout = normalizeLayout(
			layout
		) as NormalizedRowLayout;

		return {
			Component: ( { children }: { children: React.ReactNode } ) => (
				<VStack spacing={ 4 }>
					<div className="dataforms-layouts-row__field">
						<HStack
							spacing={ 4 }
							alignment={ normalizedLayout.alignment }
						>
							{ children }
						</HStack>
					</div>
				</VStack>
			),
		};
	}

	return {
		Component: ( { children }: { children: React.ReactNode } ) => (
			<VStack spacing={ layout?.type === 'panel' ? 2 : 4 }>
				{ children }
			</VStack>
		),
	};
};

export function DataFormLayout< Item >( {
	data,
	form,
	onChange,
	children,
	disableWrapper,
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
	disableWrapper?: boolean;
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

	const { Component } = useMemo(
		() => getContainer( disableWrapper, form.layout ),
		[ disableWrapper, form.layout ]
	);

	return (
		<Component>
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
		</Component>
	);
}
