/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { useState, useRef, useLayoutEffect } from '@wordpress/element';
import { focus } from '@wordpress/dom';
import { privateApis as routerPrivateApis } from '@wordpress/router';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { useLocation } = unlock( routerPrivateApis );

// Focus an element after a navigation. The element to focus is either
// specified by `focusSelector` (when navigating back) or it is the first
// tabbable element in the sidebar (usually the "Back" button).
function focusSidebarElement( el, direction, focusSelector ) {
	let elementToFocus;
	if ( direction === 'back' && focusSelector ) {
		elementToFocus = el.ownerDocument.querySelector( focusSelector );
	}
	if ( direction !== null && ! elementToFocus ) {
		const [ firstTabbable ] = focus.tabbable.find( el );
		elementToFocus = firstTabbable ?? el;
	}
	elementToFocus?.focus();
}

/**
 * Helper for creating `navStep` state that’s used to manage animations and focus.
 * @param {'back'|'forward'} direction
 * @param {string}           [focusSelector]
 */
export function useNavStep( direction, focusSelector ) {
	const { navStep: priorNavStep = {} } = useLocation().state || {};
	return {
		navStep: {
			direction,
			focusSelector:
				direction === 'forward' && focusSelector
					? focusSelector
					: priorNavStep.focusSelector,
		},
	};
}

function SidebarContentWrapper( { children, shouldAnimate } ) {
	const { navStep } = useLocation().state || {};
	const wrapperRef = useRef();
	const [ navAnimation, setNavAnimation ] = useState( null );

	useLayoutEffect( () => {
		if ( navStep ) {
			const { direction, focusSelector } = navStep;
			focusSidebarElement( wrapperRef.current, direction, focusSelector );
			setNavAnimation( direction ?? null );
		}
	}, [ navStep ] );

	const wrapperCls = clsx(
		'edit-site-sidebar__screen-wrapper',
		/*
		 * Some panes do not have sub-panes and therefore
		 * should not animate when clicked on.
		 */
		shouldAnimate
			? {
					'slide-from-left': navAnimation === 'back',
					'slide-from-right': navAnimation === 'forward',
			  }
			: {}
	);

	return (
		<div ref={ wrapperRef } className={ wrapperCls }>
			{ children }
		</div>
	);
}

export default function SidebarContent( {
	routeKey,
	shouldAnimate,
	children,
} ) {
	return (
		<div className="edit-site-sidebar__content">
			<SidebarContentWrapper
				shouldAnimate={ shouldAnimate }
				key={ routeKey }
			>
				{ children }
			</SidebarContentWrapper>
		</div>
	);
}
