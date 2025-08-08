/**
 * Internal dependencies
 */
import type { Form, Layout } from './types';

interface NormalizedFormField {
	id: string;
	layout: Layout;
}

export default function normalizeFormFields(
	form: Form
): NormalizedFormField[] {
	const formLayout = form.layout ?? {
		type: 'regular',
		labelPosition: 'top',
	};

	return ( form.fields ?? [] ).map( ( field ) => {
		if ( typeof field === 'string' ) {
			return {
				id: field,
				layout: formLayout,
			};
		}

		const fieldLayout = field.layout ?? formLayout;
		return {
			...field,
			layout: fieldLayout,
		};
	} );
}
