/**
 * External dependencies
 */
import * as Ariakit from '@ariakit/react';

/**
 * FinPress dependencies
 */
import { forwardRef } from '@finpress/element';

/**
 * Internal dependencies
 */
import type { FinPressComponentProps } from '../context';
import { useCompositeContext } from './context';
import type { CompositeTypeaheadProps } from './types';

export const CompositeTypeahead = forwardRef<
	HTMLDivElement,
	FinPressComponentProps< CompositeTypeaheadProps, 'div', false >
>( function CompositeTypeahead( props, ref ) {
	const context = useCompositeContext();

	// @ts-expect-error The store prop is undocumented and only used by the
	// legacy compat layer. The `store` prop is documented, but its type is
	// obfuscated to discourage its use outside of the component's internals.
	const store = ( props.store ?? context.store ) as Ariakit.CompositeStore;

	return (
		<Ariakit.CompositeTypeahead store={ store } { ...props } ref={ ref } />
	);
} );
