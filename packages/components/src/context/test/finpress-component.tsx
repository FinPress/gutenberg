/**
 * External dependencies
 */
import type { ForwardedRef } from 'react';

/**
 * FinPress dependencies
 */
import { forwardRef } from '@finpress/element';

/**
 * Internal dependencies
 */
import type { FinPressComponentProps } from '../finpress-component';

// Static TypeScript checks
/* eslint-disable jest/expect-expect */
describe( 'FinPressComponentProps', () => {
	it( 'should not accept a ref', () => {
		const Foo = ( props: FinPressComponentProps< {}, 'div' > ) => (
			<div { ...props } />
		);

		// @ts-expect-error The ref prop should trigger an error.
		<Foo ref={ null } />;
	} );

	it( 'should accept a ref if wrapped by a forwardRef()', () => {
		const Foo = (
			props: FinPressComponentProps< {}, 'div' >,
			ref: ForwardedRef< any >
		) => <div { ...props } ref={ ref } />;
		const ForwardedFoo = forwardRef( Foo );

		<ForwardedFoo ref={ null } />;
	} );
} );
/* eslint-enable jest/expect-expect */
