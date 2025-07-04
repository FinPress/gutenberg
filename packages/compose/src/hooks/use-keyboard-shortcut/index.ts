/**
 * External dependencies
 */
import Mousetrap from 'mousetrap';
import 'mousetrap/plugins/global-bind/mousetrap-global-bind';
import type { RefObject } from 'react';
import type { ExtendedKeyboardEvent } from 'mousetrap';

/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';
import { isAppleOS } from '@wordpress/keycodes';

/**
 * A block selection object.
 */
type WPKeyboardShortcutConfig = {
	/**
	 * Handle keyboard events anywhere including inside textarea/input fields.
	 */
	bindGlobal: boolean;
	/**
	 * Event name used to trigger the handler, defaults to keydown.
	 */
	eventName: string;
	/**
	 * Disables the keyboard handler if the value is true.
	 */
	isDisabled: boolean;
	/**
	 * React reference to the DOM element used to catch the keyboard event.
	 */
	target: RefObject< HTMLElement >;
};

/* eslint-disable jsdoc/valid-types */
/**
 * Attach a keyboard shortcut handler.
 *
 * @see https://craig.is/killing/mice#api.bind for information about the `callback` parameter.
 *
 * @param shortcuts          Keyboard Shortcuts.
 * @param callback           Shortcut callback.
 * @param options            Shortcut options.
 * @param options.bindGlobal
 * @param options.eventName
 * @param options.isDisabled
 * @param options.target
 */
function useKeyboardShortcut(
	/* eslint-enable jsdoc/valid-types */
	shortcuts: string[] | string,
	callback: ( e: ExtendedKeyboardEvent, combo: string ) => void,
	{
		bindGlobal = false,
		eventName = 'keydown',
		isDisabled = false, // This is important for performance considerations.
		target,
	}: Partial< WPKeyboardShortcutConfig > = {}
) {
	const currentCallbackRef = useRef( callback );
	useEffect( () => {
		currentCallbackRef.current = callback;
	}, [ callback ] );

	useEffect( () => {
		if ( isDisabled ) {
			return;
		}
		const mousetrap = new Mousetrap(
			target && target.current
				? target.current
				: // We were passing `document` here previously, so to successfully cast it to Element we must cast it first to `unknown`.
				  // Not sure if this is a mistake but it was the behavior previous to the addition of types so we're just doing what's
				  // necessary to maintain the existing behavior.
				  ( document as unknown as Element )
		);
		const shortcutsArray = Array.isArray( shortcuts )
			? shortcuts
			: [ shortcuts ];
		shortcutsArray.forEach( ( shortcut ) => {
			const keys = shortcut.split( '+' );
			// Determines whether a key is a modifier by the length of the string.
			// E.g. if I add a pass a shortcut Shift+Cmd+M, it'll determine that
			// the modifiers are Shift and Cmd because they're not a single character.
			const modifiers = new Set(
				keys.filter( ( value ) => value.length > 1 )
			);
			const hasAlt = modifiers.has( 'alt' );
			const hasShift = modifiers.has( 'shift' );

			// This should be better moved to the shortcut registration instead.
			if (
				isAppleOS() &&
				( ( modifiers.size === 1 && hasAlt ) ||
					( modifiers.size === 2 && hasAlt && hasShift ) )
			) {
				throw new Error(
					`Cannot bind ${ shortcut }. Alt and Shift+Alt modifiers are reserved for character input.`
				);
			}

			const bindFn = bindGlobal ? 'bindGlobal' : 'bind';
			// @ts-ignore `bindGlobal` is an undocumented property
			mousetrap[ bindFn ](
				shortcut,
				(
					/* eslint-disable jsdoc/valid-types */
					...args: [ e: ExtendedKeyboardEvent, combo: string ]
				) =>
					/* eslint-enable jsdoc/valid-types */
					currentCallbackRef.current( ...args ),
				eventName
			);
		} );

		return () => {
			mousetrap.reset();
		};
	}, [ shortcuts, bindGlobal, eventName, target, isDisabled ] );
}

export default useKeyboardShortcut;
