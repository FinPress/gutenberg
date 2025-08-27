/**
 * WordPress dependencies
 */
import {
	__experimentalHStack as HStack,
	__experimentalSpacer as Spacer,
	__experimentalVStack as VStack,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { FieldLayoutProps, Form, NormalizedRowLayout } from '../../types';
import DataFormContext from '../../components/dataform-context';
import { DataFormLayout } from '../data-form-layout';
import { isCombinedField } from '../is-combined-field';
import { normalizeLayout } from '../../normalize-form-fields';
import { getFormFieldLayout } from '..';

function Header( { title }: { title: string } ) {
	return (
		<VStack className="dataforms-layouts-row__header" spacing={ 4 }>
			<HStack alignment="center">
				<Heading level={ 2 } size={ 13 }>
					{ title }
				</Heading>
				<Spacer />
			</HStack>
		</VStack>
	);
}

export default function FormRowField< Item >( {
	data,
	field,
	onChange,
	hideLabelFromVision,
}: FieldLayoutProps< Item > ) {
	const { fields } = useContext( DataFormContext );

	const layout = normalizeLayout( {
		...field.layout,
		type: 'row',
	} ) as NormalizedRowLayout;

	if ( isCombinedField( field ) ) {
		const form = {
			fields: field.children.map( ( child ) => {
				if ( typeof child === 'string' ) {
					return { id: child };
				}
				return child;
			} ),
		} as Form;

		return (
			<div className="dataforms-layouts-row__field">
				{ ! hideLabelFromVision && field.label && (
					<Header title={ field.label } />
				) }
				<HStack spacing={ layout.gap }>
					<DataFormLayout
						data={ data }
						form={ form }
						onChange={ onChange }
						disableWrapper
					>
						{ ( FieldLayout, nestedField ) => (
							<div
								key={ nestedField.id }
								className="dataforms-layouts-row__field-item"
							>
								<FieldLayout
									data={ data }
									field={ nestedField }
									onChange={ onChange }
									hideLabelFromVision={ hideLabelFromVision }
								/>
							</div>
						) }
					</DataFormLayout>
				</HStack>
			</div>
		);
	}

	const fieldDefinition = fields.find( ( f ) => f.id === field.id );

	if ( ! fieldDefinition || ! fieldDefinition.Edit ) {
		return null;
	}

	const RegularLayout = getFormFieldLayout( 'regular' )?.component;
	if ( ! RegularLayout ) {
		return null;
	}

	return (
		<div className="dataforms-layouts-row__field">
			{ ! hideLabelFromVision && fieldDefinition.label && (
				<Header title={ fieldDefinition.label } />
			) }
			<RegularLayout
				data={ data }
				field={ fieldDefinition }
				onChange={ onChange }
				hideLabelFromVision={ hideLabelFromVision }
			/>
		</div>
	);
}
