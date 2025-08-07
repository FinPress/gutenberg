/**
 * Internal dependencies
 */
import type { Layout, LayoutType } from './layout-types';
import type { Form } from './types';

interface NormalizedFormField {
	id: string;
	layout: Layout;
}

export default function normalizeFormFields(
	form: Form
): NormalizedFormField[] {
	let layout: LayoutType = 'regular';
	const formLayout = form.layout ?? {
		type: 'regular',
		labelPosition: 'top',
	};
	if ( [ 'regular', 'panel', 'card' ].includes( formLayout.type ?? '' ) ) {
		layout = formLayout.type as 'regular' | 'panel' | 'card';
	}

	const labelPosition =
		formLayout.labelPosition ?? ( layout === 'regular' ? 'top' : 'side' );

	return ( form.fields ?? [] ).map( ( field ) => {
		if ( typeof field === 'string' ) {
			return {
				id: field,
				layout: {
					type: layout,
					labelPosition,
				} as Layout,
			};
		}

		const fieldLayout = field.layout ?? formLayout;
		const fieldLabelPosition =
			fieldLayout.labelPosition ??
			( fieldLayout.type === 'regular' ? 'top' : 'side' );
		return {
			...field,
			layout: {
				type: fieldLayout.type,
				labelPosition: fieldLabelPosition,
			} as Layout,
		};
	} );
}
