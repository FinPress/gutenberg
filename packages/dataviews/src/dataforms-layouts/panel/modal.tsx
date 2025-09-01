/**
 * WordPress dependencies
 */
import {
	__experimentalHStack as HStack,
	__experimentalSpacer as Spacer,
	Button,
	Modal,
} from '@wordpress/components';
import { __, sprintf, _x } from '@wordpress/i18n';
import { useState, useMemo, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { Form, FormField, NormalizedField } from '../../types';
import { DataFormLayout } from '../data-form-layout';
import { isCombinedField } from '../is-combined-field';
import { DEFAULT_LAYOUT } from '../../normalize-form-fields';
import DataFormContext, {
	DataFormProvider,
} from '../../components/dataform-context';

function ModalContent< Item >( {
	data,
	form,
	fieldLabel,
	onChange,
	onClose,
}: {
	data: Item;
	form: Form;
	fieldLabel: string;
	onChange: ( data: Partial< Item > ) => void;
	onClose: () => void;
} ) {
	const { fields } = useContext( DataFormContext );
	const [ changes, setChanges ] = useState< Partial< Item > >( {} );

	const onApply = () => {
		onChange( changes );
		onClose();
	};

	const handleOnChange = ( value: Partial< Item > ) => {
		setChanges( ( prev ) => ( { ...prev, ...value } ) );
	};

	// Create flattened data and modified field definitions
	const { flattenedData, modifiedFields } = useMemo( () => {
		// It will be a mix of original structure for fields without getValue,
		// and a flattened object in shape of { [fieldId]: fieldValue }
		const newFlattenedData: { [ key: string ]: any } = {};

		const newModifiedFields = fields.map( ( field ) => {
			// Extract the value using getValue function
			const extractedValue = field.getValue( { item: data } );
			newFlattenedData[ field.id ] = extractedValue;

			// Return a modified field that reads from the flat structure
			return {
				...field,
				// Usage of any here is aligned with the type declaration for
				// getValue (it returns any as well)
				getValue: ( { item }: { item: Item } ) =>
					( item as any )[ field.id ],
			};
		} );

		return {
			flattenedData: newFlattenedData,
			modifiedFields: newModifiedFields,
		};
	}, [ fields, data ] );

	// Merge flattened data with local changes
	const displayData = { ...flattenedData, ...changes };

	return (
		<Modal
			className="dataforms-layouts-panel__modal"
			onRequestClose={ onClose }
			isFullScreen={ false }
			title={ fieldLabel }
			size="medium"
		>
			<DataFormProvider fields={ modifiedFields }>
				<DataFormLayout
					data={ displayData }
					form={ form }
					onChange={ handleOnChange }
				>
					{ ( FieldLayout, nestedField ) => (
						<FieldLayout
							key={ nestedField.id }
							data={ displayData }
							field={ nestedField }
							onChange={ handleOnChange }
							hideLabelFromVision={
								( form?.fields ?? [] ).length < 2
							}
						/>
					) }
				</DataFormLayout>
			</DataFormProvider>
			<HStack
				className="dataforms-layouts-panel__modal-footer"
				spacing={ 3 }
			>
				<Spacer />
				<Button
					variant="tertiary"
					onClick={ onClose }
					__next40pxDefaultSize
				>
					{ __( 'Cancel' ) }
				</Button>
				<Button
					variant="primary"
					onClick={ onApply }
					__next40pxDefaultSize
				>
					{ __( 'Apply' ) }
				</Button>
			</HStack>
		</Modal>
	);
}

function PanelModal< Item >( {
	fieldDefinition,
	labelPosition,
	data,
	onChange,
	field,
}: {
	fieldDefinition: NormalizedField< Item >;
	labelPosition: 'side' | 'top' | 'none';
	data: Item;
	onChange: ( value: any ) => void;
	field: FormField;
} ) {
	const [ isOpen, setIsOpen ] = useState( false );

	const fieldLabel = isCombinedField( field )
		? field.label
		: fieldDefinition?.label;

	const form: Form = useMemo(
		(): Form => ( {
			layout: DEFAULT_LAYOUT,
			fields: isCombinedField( field )
				? field.children
				: // If not explicit children return the field id itself.
				  [ { id: field.id } ],
		} ),
		[ field ]
	);

	return (
		<>
			<Button
				className="dataforms-layouts-modal__field-control"
				size="compact"
				variant={
					[ 'none', 'top' ].includes( labelPosition )
						? 'link'
						: 'tertiary'
				}
				aria-expanded={ isOpen }
				aria-label={ sprintf(
					// translators: %s: Field name.
					_x( 'Edit %s', 'field' ),
					fieldLabel || ''
				) }
				onClick={ () => setIsOpen( true ) }
				disabled={ fieldDefinition.readOnly === true }
				accessibleWhenDisabled
			>
				<fieldDefinition.render
					item={ data }
					field={ fieldDefinition }
				/>
			</Button>
			{ isOpen && (
				<ModalContent
					data={ data }
					form={ form as Form }
					fieldLabel={ fieldLabel ?? '' }
					onChange={ onChange }
					onClose={ () => setIsOpen( false ) }
				/>
			) }
		</>
	);
}

export default PanelModal;
