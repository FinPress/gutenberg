/**
 * WordPress dependencies
 */
import { useMemo, useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { DataFormProps } from '../../types';
import { DataFormProvider } from '../dataform-context';
import { normalizeFields } from '../../normalize-fields';
import { DataFormLayout } from '../../dataforms-layouts/data-form-layout';

export default function DataForm< Item >( {
	data,
	form,
	fields,
	onChange,
	onValidate,
}: DataFormProps< Item > ) {
	const normalizedFields = useMemo(
		() => normalizeFields( fields ),
		[ fields ]
	);

	const onValidateCb = useCallback(
		( isValid: boolean | undefined, isValidating: boolean ) => {
			if ( ! onValidate ) {
				return;
			}

			onValidate( isValid, isValidating );
		},
		[ onValidate ]
	);

	if ( ! form.fields ) {
		return null;
	}

	return (
		<DataFormProvider fields={ normalizedFields }>
			<DataFormLayout
				data={ data }
				form={ form }
				onChange={ onChange }
				onValidate={ onValidateCb }
			/>
		</DataFormProvider>
	);
}
