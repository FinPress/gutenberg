/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { Button, Card, CardBody, CardHeader } from '@wordpress/components';
import { useCallback, useContext, useMemo, useState } from '@wordpress/element';
import { chevronDown, chevronUp } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { getFormFieldLayout } from '..';
import DataFormContext from '../../components/dataform-context';
import type { FieldLayoutProps, Form, FormField } from '../../types';
import { DataFormLayout } from '../data-form-layout';
import { isCombinedField } from '../is-combined-field';
import type { CardLayout } from '../../layout-types';

const getFormLayout = ( form: Form, field: FormField ) => {
	const layout = field.layout ?? form.layout;

	if ( layout?.type ) {
		// Never return card layout to avoid nesting
		const layoutType = layout.type === 'card' ? 'regular' : layout.type;
		return getFormFieldLayout( layoutType )?.component;
	}

	return getFormFieldLayout( 'regular' )?.component;
};

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
	const { fields } = useContext( DataFormContext );

	const layout: CardLayout = ( field.layout as CardLayout ) ?? {
		type: 'regular',
		labelPosition: 'none',
		opened: true,
	};

	const form = useMemo( () => {
		if ( isCombinedField( field ) ) {
			return {
				fields: field.children.map( ( child ) => {
					if ( typeof child === 'string' ) {
						return {
							id: child,
							layout: {
								type: 'regular',
								labelPosition: 'none',
							},
						};
					}
					return child;
				} ),
				label: field.label,
			};
		}

		return {
			layout: {
				type: 'regular',
				labelPosition: 'none',
			},
			fields: [],
		};
	}, [ field ] ) as Form;

	const { isOpen, CollapsibleCardHeader } = useCollapsibleCard(
		layout.opened ?? true
	);

	if ( isCombinedField( field ) ) {
		const Layout = getFormFieldLayout( field.layout?.type ?? 'regular' )
			?.component;

		if ( ! Layout ) {
			return null;
		}

		return (
			<Card className="dataforms-layouts-card__field">
				<CollapsibleCardHeader className="dataforms-layouts-card__field-label">
					{ field.label }
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
									field={ {
										...nestedField,
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

	const Layout = getFormLayout( form, field );

	if ( ! Layout ) {
		return null;
	}

	return (
		<Card className="dataforms-layouts-card__field">
			{ cardTitle && layout.labelPosition !== 'none' && (
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
							field={ fieldDefinition }
							onChange={ onChange }
							hideLabelFromVision={ hideLabelFromVision }
						/>
					) }
				</CardBody>
			) }
		</Card>
	);
}
