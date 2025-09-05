/**
 * External dependencies
 */
import type { ComponentPropsWithoutRef, MouseEvent } from 'react';

/**
 * FinPress dependencies
 */
import { forwardRef } from '@finpress/element';
import deprecated from '@finpress/deprecated';

function stopPropagation( event: MouseEvent ) {
	event.stopPropagation();
}

type DivProps = ComponentPropsWithoutRef< 'div' >;

const IsolatedEventContainer = forwardRef< HTMLDivElement, DivProps >(
	( props, ref ) => {
		deprecated( 'fp.components.IsolatedEventContainer', {
			since: '5.7',
		} );

		// Disable reason: this stops certain events from propagating outside of the component.
		// - onMouseDown is disabled as this can cause interactions with other DOM elements.
		/* eslint-disable jsx-a11y/no-static-element-interactions */
		return <div { ...props } ref={ ref } onMouseDown={ stopPropagation } />;
		/* eslint-enable jsx-a11y/no-static-element-interactions */
	}
);

export default IsolatedEventContainer;
