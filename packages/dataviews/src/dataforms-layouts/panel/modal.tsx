/**
 * WordPress dependencies
 */
import {
	__experimentalHStack as HStack,
	__experimentalSpacer as Spacer,
	Button,
	Modal,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { Form, FormField, NormalizedField } from '../../types';
import { DataFormLayout } from '../data-form-layout';
import { isCombinedField } from '../is-combined-field';
import { DEFAULT_LAYOUT } from '../../normalize-form-fields';

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
	const [ localData, setLocalData ] = useState< Item >( data );

	const onApply = () => {
		onChange( localData );
		onClose();
	};

	const handleOnChange = ( value: Partial< Item > ) => {
		setLocalData( ( prev ) => ( { ...prev, ...value } ) );
	};

	return (
		<Modal
			className="dataforms-layouts-panel__dropdown"
			onRequestClose={ onClose }
			isFullScreen={ false }
			title={ fieldLabel }
			size="medium"
		>
			<DataFormLayout
				data={ localData }
				form={ form }
				onChange={ handleOnChange }
			>
				{ ( FieldLayout, nestedField ) => (
					<FieldLayout
						key={ nestedField.id }
						data={ localData }
						field={ nestedField }
						onChange={ handleOnChange }
						hideLabelFromVision={
							( form?.fields ?? [] ).length < 2
						}
					/>
				) }
			</DataFormLayout>
			<HStack
				className="dataforms-layouts-panel__dropdown-footer"
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
	data,
	onChange,
	field,
}: {
	fieldDefinition: NormalizedField< Item >;
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
				className="dataforms-layouts-panel__dropdown-button"
				size="compact"
				variant="link"
				onClick={ () => setIsOpen( true ) }
				disabled={ fieldDefinition.readOnly === true }
				accessibleWhenDisabled
			>
				{ isCombinedField( field ) && field?.content ? (
					field.content
				) : (
					<fieldDefinition.render
						item={ data }
						field={ fieldDefinition }
					/>
				) }
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
