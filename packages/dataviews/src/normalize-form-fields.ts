/**
 * Internal dependencies
 */
import type {
	Form,
	Layout,
	NormalizedLayout,
	NormalizedRegularLayout,
	NormalizedPanelLayout,
	NormalizedCardLayout,
} from './types';

interface NormalizedFormField {
	id: string;
	layout: Layout;
}

export const DEFAULT_LAYOUT: NormalizedLayout = {
	type: 'regular',
	labelPosition: 'top',
};

/**
 * Normalizes a layout configuration based on its type.
 *
 * @param layout The layout object to normalize.
 * @return The normalized layout object.
 */
export function normalizeLayout( layout?: Layout ): NormalizedLayout {
	let normalizedLayout = DEFAULT_LAYOUT;

	if ( layout?.type === 'regular' ) {
		normalizedLayout = {
			type: 'regular',
			labelPosition: layout?.labelPosition ?? 'top',
		} satisfies NormalizedRegularLayout;
	} else if ( layout?.type === 'panel' ) {
		normalizedLayout = {
			type: 'panel',
			labelPosition: layout?.labelPosition ?? 'side',
		} satisfies NormalizedPanelLayout;
	} else if ( layout?.type === 'card' ) {
		if ( layout.withHeader === false ) {
			// Don't let isOpened be false if withHeader is false.
			// Otherwise, the card will not be visible.
			normalizedLayout = {
				type: 'card',
				withHeader: false,
				isOpened: true,
			} satisfies NormalizedCardLayout;
		} else {
			normalizedLayout = {
				type: 'card',
				withHeader: true,
				isOpened:
					typeof layout.isOpened === 'boolean'
						? layout.isOpened
						: true,
			} satisfies NormalizedCardLayout;
		}
	}

	return normalizedLayout;
}

export default function normalizeFormFields(
	form: Form
): NormalizedFormField[] {
	return ( form ?? [] ).map( ( field ) => {
		if ( typeof field === 'string' ) {
			return {
				id: field,
				layout: DEFAULT_LAYOUT,
			};
		}

		const fieldLayout = field.layout
			? normalizeLayout( field.layout )
			: DEFAULT_LAYOUT;
		return {
			...field,
			layout: fieldLayout,
		};
	} );
}
