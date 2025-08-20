/**
 * WordPress dependencies
 */
import {
	Flex,
	BaseControl,
	__experimentalNumberControl as NumberControl,
	privateApis,
} from '@wordpress/components';
import { useCallback, useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { OPERATOR_BETWEEN } from '../constants';
import type { DataFormControlProps } from '../types';
import { unlock } from '../lock-unlock';

const { ValidatedNumberControl } = unlock( privateApis );

function BetweenControls< Item >( {
	id,
	value,
	onChange,
	hideLabelFromVision,
}: {
	id: string;
	value: any;
	onChange: DataFormControlProps< Item >[ 'onChange' ];
	hideLabelFromVision?: boolean;
} ) {
	const [ min = '', max = '' ] = Array.isArray( value ) ? value : [];

	const onChangeMin = useCallback(
		( newValue: string | undefined ) =>
			onChange( {
				[ id ]: [ Number( newValue ), max ],
			} ),
		[ id, onChange, max ]
	);

	const onChangeMax = useCallback(
		( newValue: string | undefined ) =>
			onChange( {
				[ id ]: [ min, Number( newValue ) ],
			} ),
		[ id, onChange, min ]
	);

	return (
		<BaseControl
			__nextHasNoMarginBottom
			help={ __( 'The max. value must be greater than the min. value.' ) }
		>
			<Flex direction="row" gap={ 4 }>
				<NumberControl
					label={ __( 'Min.' ) }
					value={ min }
					max={ max ? Number( max ) - 1 : undefined }
					onChange={ onChangeMin }
					__next40pxDefaultSize
					hideLabelFromVision={ hideLabelFromVision }
				/>
				<NumberControl
					label={ __( 'Max.' ) }
					value={ max }
					min={ min ? Number( min ) + 1 : undefined }
					onChange={ onChangeMax }
					__next40pxDefaultSize
					hideLabelFromVision={ hideLabelFromVision }
				/>
			</Flex>
		</BaseControl>
	);
}

export default function Integer< Item >( {
	data,
	field,
	onChange,
	hideLabelFromVision,
	operator,
}: DataFormControlProps< Item > ) {
	const { id, label, description } = field;
	const value = field.getValue( { item: data } ) ?? '';
	const [ customValidity, setCustomValidity ] =
		useState<
			React.ComponentProps<
				typeof ValidatedNumberControl
			>[ 'customValidity' ]
		>( undefined );

	const onChangeControl = useCallback(
		( newValue: string | undefined ) => {
			onChange( {
				// Do not convert an empty string or undefined to a number,
				// otherwise there's a mismatch between the UI control (empty)
				// and the data relied by onChange (0).
				[ id ]: [ '', undefined ].includes( newValue )
					? undefined
					: Number( newValue ),
			} );
		},
		[ id, onChange ]
	);

	// onValidate needs access to the latest value that has been validated
	// to bail early if it didn't change.
	//
	// We can't use the value directly because it is updated by onChange,
	// and so there may be race conditions between onChange and onValidate.
	const previousValidatedValueRef = useRef< unknown >( value );

	if ( operator === OPERATOR_BETWEEN ) {
		return (
			<BetweenControls
				id={ id }
				value={ value }
				onChange={ onChange }
				hideLabelFromVision={ hideLabelFromVision }
			/>
		);
	}

	return (
		<ValidatedNumberControl
			required={ !! field.isValid?.required }
			onValidate={ ( newValue: any ) => {
				// Do not trigger validation if the value is the same as before.
				if ( newValue === previousValidatedValueRef.current ) {
					return;
				}
				previousValidatedValueRef.current = newValue;

				const message = field.isValid?.custom?.(
					{
						...data,
						[ id ]: [ undefined, '', null ].includes( newValue )
							? undefined
							: Number( newValue ),
					},
					field
				);

				// Async validation:
				// validity can be validating, invalid, valid.
				if ( message instanceof Promise ) {
					setCustomValidity( {
						type: 'validating',
						message: 'Validating...',
					} );

					message
						.then( ( result ) => {
							if ( result ) {
								setCustomValidity( {
									type: 'invalid',
									message: result,
								} );
							} else {
								setCustomValidity( {
									type: 'valid',
									message: 'Validated',
								} );
							}
						} )
						.catch( ( error ) => {
							setCustomValidity( {
								type: 'invalid',
								message: error.message,
							} );
						} );

					return;
				}

				// Sync validation:
				// validity is either invalid or undefined (nothing displayed).
				if ( message ) {
					setCustomValidity( {
						type: 'invalid',
						message,
					} );
					return;
				}

				setCustomValidity( undefined );
			} }
			customValidity={ customValidity }
			label={ label }
			help={ description }
			value={ value }
			onChange={ onChangeControl }
			__next40pxDefaultSize
			hideLabelFromVision={ hideLabelFromVision }
		/>
	);
}
