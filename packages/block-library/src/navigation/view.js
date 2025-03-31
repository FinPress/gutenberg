/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const focusableSelectors = [
	'a[href]',
	'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
	'select:not([disabled]):not([aria-hidden])',
	'textarea:not([disabled]):not([aria-hidden])',
	'button:not([disabled]):not([aria-hidden])',
	'[contenteditable]',
	'[tabindex]:not([tabindex^="-"])',
];

const openedByNone = { click: false, focus: false, hover: false };

const hasCommandSupport =
	window.HTMLButtonElement.prototype.hasOwnProperty( 'command' );

// This is a fix for Safari in iOS/iPadOS. Without it, Safari doesn't focus out
// when the user taps in the body. It can be removed once we add an overlay to
// capture the clicks, instead of relying on the focusout event.
document.addEventListener( 'click', () => {} );

const { state, actions } = store(
	'core/navigation',
	{
		state: {
			get ariaLabel() {
				const ctx = getContext();
				return ctx.type === 'overlay' && state.isMenuOpen
					? ctx.ariaLabel
					: null;
			},
			get isMenuOpen() {
				// The menu is opened if either `click`, `hover` or `focus` is true.
				return (
					Object.values( state.menuOpenedBy ).filter( Boolean )
						.length > 0
				);
			},
			get menuOpenedBy() {
				const ctx = getContext();
				return ctx.type === 'overlay'
					? ctx.overlayOpenedBy
					: ctx.submenuOpenedBy;
			},
		},
		actions: {
			openMenuOnHover() {
				const { overlayOpenedBy } = getContext();
				// Opens only if the overlay is closed.
				if ( Object.values( overlayOpenedBy || {} ).some( Boolean ) ) {
					actions.openMenu( 'hover' );
				}
			},
			closeMenuOnHover() {
				const { overlayOpenedBy, submenuOpenedBy } = getContext();
				// Closes only if not opened by click and the overlay is closed.
				if (
					submenuOpenedBy.click === false &&
					Object.values( overlayOpenedBy || {} ).some( Boolean )
				) {
					actions.closeMenu();
				}
			},
			openMenuOnClick() {
				const ctx = getContext();
				const { ref } = getElement();
				ctx.previousFocus = ref;
				actions.openMenu( 'click' );
			},
			openMenuOnFocus() {
				actions.openMenu( 'focus' );
			},
			toggleMenuOnClick() {
				const ctx = getContext();
				const { ref } = getElement();
				// Safari won't send focus to the clicked element, so we need to manually place it: https://bugs.webkit.org/show_bug.cgi?id=22261
				if ( window.document.activeElement !== ref ) {
					ref.focus();
				}
				const { menuOpenedBy } = state;
				if ( menuOpenedBy.click || menuOpenedBy.focus ) {
					actions.closeMenu();
				} else {
					ctx.previousFocus = ref;
					actions.openMenu( 'click' );
				}
			},
			handleMenuKeydown: ( { key } ) => {
				if ( state.menuOpenedBy.click ) {
					// If Escape close the menu.
					if ( key === 'Escape' ) {
						actions.closeMenu();
					}
				}
			},
			handleMenuFocusout( event ) {
				const { modal } = getContext();
				// If focus is outside modal, and in the document, close menu
				// event.target === The element losing focus
				// event.relatedTarget === The element receiving focus (if any)
				// When focusout is outside the document,
				// `window.document.activeElement` doesn't change.

				// The event.relatedTarget is null when something outside the navigation menu is clicked. This is only necessary for Safari.
				if (
					event.relatedTarget === null ||
					( ! modal?.contains( event.relatedTarget ) &&
						event.target !== window.document.activeElement )
				) {
					actions.closeMenu();
				}
			},
			openMenu( menuOpenedOn = 'click' ) {
				state.menuOpenedBy[ menuOpenedOn ] = true;
			},
			closeMenu() {
				// For the overlay, this would be redundant if the close button was
				// clicked and `command` is not supported. It’s not redundant in case
				// `command` is supported or closed by way of Escape key press.
				if ( state.isMenuOpen ) {
					Object.assign( state.menuOpenedBy, openedByNone );
				}
			},
		},
		callbacks: {
			effectOpenClose() {
				const ctx = getContext();
				// Skips initial run.
				if ( ! state.isMenuOpen && ! ctx.modal ) {
					return;
				}
				const { ref } = getElement();
				if ( state.isMenuOpen ) {
					ctx.modal = ref;
				} else {
					const { activeElement } = window.document;
					if ( ctx.modal.contains( activeElement ) ) {
						ctx.previousFocus?.focus();
					}
					ctx.modal = null;
					ctx.previousFocus = null;
				}
				if ( ctx.type === 'overlay' ) {
					// Toggles `has-modal-open` class on the <html> root.
					document.documentElement.classList.toggle(
						'has-modal-open',
						state.isMenuOpen
					);
					if ( ! hasCommandSupport ) {
						ref[ state.isMenuOpen ? 'showModal' : 'close' ]();
					}
				}
			},
			focusFirstElement() {
				const { ref } = getElement();
				if ( state.isMenuOpen ) {
					const focusableElements =
						ref.querySelectorAll( focusableSelectors );
					focusableElements?.[ 0 ]?.focus();
				}
			},
		},
	},
	{ lock: true }
);
