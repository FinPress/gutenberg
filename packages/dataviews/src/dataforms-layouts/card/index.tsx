/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { useContext, useMemo, useState, useCallback } from '@wordpress/element';
import { Card, CardHeader, CardBody, Button } from '@wordpress/components';
import { chevronDown, chevronUp } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import type { Form, FieldLayoutProps } from '../../types';
import DataFormContext from '../../components/dataform-context';
import { DataFormLayout } from '../data-form-layout';
import { isCombinedField } from '../is-combined-field';

export function useCollapsibleCard( initialIsOpen: boolean = true ) {
	const [ isOpen, setIsOpen ] = useState( initialIsOpen );

	const toggle = useCallback( () => {
		setIsOpen( ( prev ) => ! prev );
	}, [] );

	const CollapsibleCardHeader = useCallback(
		( {
			children,
			...props
		}: {
			children: React.ReactNode;
			[ key: string ]: any;
		} ) => (
			<CardHeader
				{ ...props }
				onClick={ toggle }
				style={ {
					cursor: 'pointer',
					...props.style,
				} }
			>
				<div
					style={ {
						width: '100%',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					} }
				>
					{ children }
				</div>
				<Button
					__next40pxDefaultSize
					variant="tertiary"
					icon={ isOpen ? chevronUp : chevronDown }
					aria-expanded={ isOpen }
					aria-label={ isOpen ? 'Collapse' : 'Expand' }
				/>
			</CardHeader>
		),
		[ toggle, isOpen ]
	);

	return { isOpen, CollapsibleCardHeader };
}

export default function FormCardField< Item >( {
	data,
	field,
	onChange,
	hideLabelFromVision,
}: FieldLayoutProps< Item > ) {
	const { isOpen, CollapsibleCardHeader } = useCollapsibleCard();
	const { fields } = useContext( DataFormContext );

	const form = useMemo( () => {
		if ( isCombinedField( field ) ) {
			return {
				fields: field.children.map( ( child ) => {
					if ( typeof child === 'string' ) {
						return {
							id: child,
						};
					}
					return child;
				} ),
				label: field.label,
				type: 'regular' as const,
				labelPosition: field.labelPosition ?? 'none',
			};
		}

		return {
			type: 'regular' as const,
			fields: [],
			labelPosition: field.labelPosition ?? 'none',
		};
	}, [ field ] );

	if ( isCombinedField( field ) ) {
		return (
			<Card className="dataforms-layouts-card__field">
				<CollapsibleCardHeader className="dataforms-layouts-card__field-label">
					{ form.label }
				</CollapsibleCardHeader>
				{ isOpen && (
					<CardBody className="dataforms-layouts-card__field-control">
						<DataFormLayout
							data={ data }
							form={ form as Form }
							onChange={ onChange }
						>
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
					</CardBody>
				) }
			</Card>
		);
	}

	const fieldDefinition = fields.find(
		( fieldDef ) => fieldDef.id === field.id
	);

	if ( ! fieldDefinition || ! fieldDefinition.Edit ) {
		return null;
	}

	const cardTitle = fieldDefinition.label;

	return (
		<Card className="dataforms-layouts-card__field">
			{ fieldDefinition.label && form.labelPosition !== 'none' && (
				<CollapsibleCardHeader className="dataforms-layouts-card__field-label">
					{ cardTitle }
				</CollapsibleCardHeader>
			) }
			{ isOpen && (
				<CardBody className="dataforms-layouts-card__field-control">
					<fieldDefinition.Edit
						data={ data }
						field={ fieldDefinition }
						onChange={ onChange }
						hideLabelFromVision={ hideLabelFromVision }
					/>
				</CardBody>
			) }
		</Card>
	);
}
