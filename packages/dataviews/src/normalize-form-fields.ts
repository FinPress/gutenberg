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
	let formLayout: Layout = { type: 'regular', labelPosition: 'top' };
	if ( form?.layout?.type === 'regular' ) {
		formLayout = {
			type: 'regular',
			labelPosition: form?.layout?.labelPosition ?? 'top',
		};
	} else if ( form?.layout?.type === 'panel' ) {
		formLayout = {
			type: 'panel',
			labelPosition: form?.layout?.labelPosition ?? 'side',
		};
	} else if ( form?.layout?.type === 'card' ) {
		formLayout = {
			type: 'card',
		};
	}

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
