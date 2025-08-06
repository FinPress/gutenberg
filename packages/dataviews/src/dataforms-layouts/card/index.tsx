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
import type { Form, FieldLayoutProps, CardFieldConfig } from '../../types';
import DataFormContext from '../../components/dataform-context';
import { DataFormLayout } from '../data-form-layout';
import { isCombinedField } from '../is-combined-field';
import { getFormFieldLayout } from '..';

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
	customStyle: customStyleProp,
	field,
	onChange,
	hideLabelFromVision,
}: FieldLayoutProps< Item > ) {
	const { fields } = useContext( DataFormContext );

	const form = useMemo( () => {
		if ( isCombinedField( field ) ) {
			return {
				fields: field.children.map( ( child ) => {
					if ( typeof child === 'string' ) {
						return {
							id: child,
							customStyle: customStyleProp,
						};
					}
					return child;
				} ),
				label: field.label,
			};
		}

		return {
			customStyle: customStyleProp,
			type: 'regular' as const,
			fields: [],
		};
	}, [ customStyleProp, field ] );

	const customStyle =
		( field.customStyle as CardFieldConfig ) ??
		( customStyleProp as CardFieldConfig );

	const { isOpen, CollapsibleCardHeader } = useCollapsibleCard(
		customStyle?.opened ?? true
	);

	if ( isCombinedField( field ) ) {
		const Layout = getFormFieldLayout(
			customStyle?.innerLayout ?? 'regular'
		)?.component;

		if ( ! Layout ) {
			return null;
		}

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
								<Layout
									key={ nestedField.id }
									data={ data }
									field={ {
										...nestedField,
										// Apply inner label position for nested fields
										labelPosition:
											customStyle?.innerLabelPosition ??
											customStyle?.labelPosition,
									} }
									onChange={ onChange }
									hideLabelFromVision={ hideLabelFromVision }
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

	const Layout = getFormFieldLayout( customStyle?.innerLayout ?? 'regular' )
		?.component;

	if ( ! Layout ) {
		return null;
	}

	return (
		<Card className="dataforms-layouts-card__field">
			{ cardTitle && customStyle?.labelPosition !== 'none' && (
				<CollapsibleCardHeader className="dataforms-layouts-card__field-label">
					{ cardTitle }
				</CollapsibleCardHeader>
			) }
			{ isOpen && (
				<CardBody className="dataforms-layouts-card__field-control">
					{ fieldDefinition.readOnly === true ? (
						<fieldDefinition.render
							item={ data }
							field={ fieldDefinition }
						/>
					) : (
						<Layout
							data={ data }
							field={ {
								...field,
								// The label position for inner layouts is always none
								labelPosition:
									customStyle?.innerLabelPosition ??
									customStyle?.labelPosition,
							} }
							onChange={ onChange }
							hideLabelFromVision={ hideLabelFromVision }
						/>
					) }
				</CardBody>
			) }
		</Card>
	);
}
