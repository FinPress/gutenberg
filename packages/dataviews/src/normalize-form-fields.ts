/**
 * Internal dependencies
 */
import type {
	CardFieldConfig,
	Form,
	PanelFieldConfig,
	RegularFieldConfig,
	FormField,
} from './types';

// Update NormalizedFormField to match the discriminated union structure
export type NormalizedFormField = {
	id: string;
	labelPosition?: 'side' | 'top' | 'none';
} & (
	| {
			layout: 'regular';
			customStyle?: RegularFieldConfig;
	  }
	| {
			layout: 'panel';
			customStyle?: PanelFieldConfig;
	  }
	| {
			layout: 'card';
			customStyle?: CardFieldConfig;
	  }
);

// For combined fields, we need to preserve the children
export type NormalizedCombinedFormField = NormalizedFormField & {
	label?: string;
	children: Array< FormField | string >;
};

export type NormalizedField = NormalizedFormField | NormalizedCombinedFormField;

export default function normalizeFormFields( form: Form ): NormalizedField[] {
	let layout: 'regular' | 'panel' | 'card' = 'regular';
	if ( [ 'regular', 'panel', 'card' ].includes( form.type ?? '' ) ) {
		layout = form.type as 'regular' | 'panel' | 'card';
	}

	const labelPosition =
		form.labelPosition ?? ( layout === 'regular' ? 'top' : 'side' );

	return ( form.fields ?? [] ).map( ( field ): NormalizedField => {
		if ( typeof field === 'string' ) {
			return {
				customStyle: form.customStyle,
				id: field,
				layout,
				labelPosition,
			} as NormalizedFormField;
		}

		const fieldLayout = field.layout ?? layout;
		const fieldLabelPosition =
			field.labelPosition ??
			( fieldLayout === 'regular' ? 'top' : 'side' );

		// If it's a combined field, preserve the children
		if ( 'children' in field ) {
			return {
				...field,
				layout: fieldLayout,
				labelPosition: fieldLabelPosition,
			} as NormalizedCombinedFormField;
		}

		return {
			...field,
			layout: fieldLayout,
			labelPosition: fieldLabelPosition,
		} as NormalizedFormField;
	} );
}
