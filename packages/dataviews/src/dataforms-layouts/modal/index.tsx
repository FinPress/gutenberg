/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
	__experimentalSpacer as Spacer,
	__experimentalHeading as Heading,
	Button,
	Modal,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState, useMemo, useContext } from '@wordpress/element';
import { closeSmall } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import type { Form, FieldLayoutProps, SimpleFormField } from '../../types';
import DataFormContext from '../../components/dataform-context';
import { DataFormLayout } from '../data-form-layout';
import { isCombinedField } from '../is-combined-field';

function DataFormModalFooter( {
	onClose,
	onCancel,
}: {
	onClose: () => void;
	onCancel: () => void;
} ) {
	return (
		<HStack className="dataforms-layouts-modal__modal-footer" spacing={ 3 }>
			<Spacer />
			<Button variant="link" onClick={ onCancel } __next40pxDefaultSize>
				{ __( 'Cancel' ) }
			</Button>
			<Button variant="primary" onClick={ onClose } __next40pxDefaultSize>
				{ __( 'Apply' ) }
			</Button>
		</HStack>
	);
}

function DataFormModalHeader( {
	title,
	onClose,
}: {
	title?: string;
	onClose: () => void;
} ) {
	return (
		<VStack className="dataforms-layouts-modal__modal-header" spacing={ 4 }>
			<HStack alignment="center">
				{ title && (
					<Heading level={ 2 } size={ 13 }>
						{ title }
					</Heading>
				) }
				<Spacer />
				{ onClose && (
					<Button
						label={ __( 'Close' ) }
						icon={ closeSmall }
						onClick={ onClose }
						size="small"
					/>
				) }
			</HStack>
		</VStack>
	);
}

function DataFormModal< Item >( {
	isOpen,
	onClose,
	data,
	form,
	onChange,
	fieldLabel,
	onCancel,
}: {
	isOpen: boolean;
	onClose: () => void;
	data: Item;
	form: Form;
	onChange: ( data: Partial< Item > ) => void;
	onCancel: () => void;
	fieldLabel: string;
} ) {
	if ( ! isOpen ) {
		return null;
	}

	return (
		<Modal
			className="dataforms-layouts-modal__modal"
			onRequestClose={ onClose }
			isFullScreen={ false }
			title={ fieldLabel }
			__experimentalHideHeader
		>
			<DataFormModalHeader title={ fieldLabel } onClose={ onClose } />
			<DataFormLayout data={ data } form={ form } onChange={ onChange }>
				{ ( FieldLayout, nestedField ) => (
					<FieldLayout
						key={ nestedField.id }
						data={ data }
						field={ nestedField }
						onChange={ onChange }
						hideLabelFromVision={
							( form?.fields ?? [] ).length < 2
						}
					/>
				) }
			</DataFormLayout>
			<DataFormModalFooter onClose={ onClose } onCancel={ onCancel } />
		</Modal>
	);
}

export default function FormModalField< Item >( {
	data,
	field,
	onChange,
}: FieldLayoutProps< Item > ) {
	const { fields } = useContext( DataFormContext );
	const [ isOpen, setIsOpen ] = useState( false );

	const fieldDefinition = fields.find( ( fieldDef ) => {
		// Default to the first child if it is a combined field.
		if ( isCombinedField( field ) ) {
			const children = field.children.filter(
				( child ): child is string | SimpleFormField =>
					typeof child === 'string' || ! isCombinedField( child )
			);
			const firstChildFieldId =
				typeof children[ 0 ] === 'string'
					? children[ 0 ]
					: children[ 0 ].id;
			return fieldDef.id === firstChildFieldId;
		}
		return fieldDef.id === field.id;
	} );

	const form = useMemo( () => {
		if ( isCombinedField( field ) ) {
			return {
				type: 'regular' as const,
				fields: field.children.map( ( child ) => {
					if ( typeof child === 'string' ) {
						return {
							id: child,
						};
					}
					return child;
				} ),
			};
		}
		// If not explicit children return the field id itself.
		return {
			type: 'regular' as const,
			fields: [ { id: field.id } ],
		};
	}, [ field ] );

	if ( ! fieldDefinition ) {
		return null;
	}

	const labelPosition = field.labelPosition ?? 'side';
	const labelClassName = clsx(
		'dataforms-layouts-modal__field-label',
		`dataforms-layouts-modal__field-label--label-position-${ labelPosition }`
	);

	const fieldLabel = isCombinedField( field )
		? field.label
		: fieldDefinition?.label;

	const handleOpenModal = () => {
		setIsOpen( true );
	};

	const handleCloseModal = () => {
		setIsOpen( false );
	};

	const handleCancelModal = () => {
		setIsOpen( false );
	};

	const renderedControl = (
		<>
			<Button
				className="dataforms-layouts-modal__field-button"
				size="compact"
				variant="link"
				onClick={ handleOpenModal }
				disabled={ fieldDefinition.readOnly === true }
				accessibleWhenDisabled
			>
				<fieldDefinition.render
					item={ data }
					field={ fieldDefinition }
				/>
			</Button>
			<DataFormModal
				isOpen={ isOpen }
				onClose={ handleCloseModal }
				onCancel={ handleCancelModal }
				data={ data }
				form={ form as Form }
				fieldLabel={ fieldLabel ?? '' }
				onChange={ onChange }
			/>
		</>
	);

	if ( labelPosition === 'top' ) {
		return (
			<VStack className="dataforms-layouts-modal__field" spacing={ 0 }>
				<div
					className={ labelClassName }
					style={ { paddingBottom: 0 } }
				>
					{ fieldLabel }
				</div>
				<div className="dataforms-layouts-modal__field-control">
					{ renderedControl }
				</div>
			</VStack>
		);
	}

	if ( labelPosition === 'none' ) {
		return (
			<div className="dataforms-layouts-modal__field">
				{ renderedControl }
			</div>
		);
	}

	// Defaults to label position side.
	return (
		<HStack className="dataforms-layouts-modal__field">
			<div className={ labelClassName }>{ fieldLabel }</div>
			<div className="dataforms-layouts-modal__field-control">
				{ renderedControl }
			</div>
		</HStack>
	);
}
