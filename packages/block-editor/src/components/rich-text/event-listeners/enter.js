/**
 * WordPress dependencies
 */
import { ENTER } from '@wordpress/keycodes';
import { insert, remove } from '@wordpress/rich-text';

// Track last Enter press timestamp
let lastEnterTime = 0;

export default ( props ) => ( element ) => {
	function onKeyDownDeprecated( event ) {
		if ( event.keyCode !== ENTER ) {
			return;
		}

		const { onReplace, onSplit } = props.current;

		if ( onReplace && onSplit ) {
			event.__deprecatedOnSplit = true;
		}
	}

	function onKeyDown( event ) {
		if ( event.defaultPrevented ) {
			return;
		}

		// The event listener is attached to the window, so we need to check if
		// the target is the element.
		if ( event.target !== element ) {
			return;
		}

		if ( event.keyCode !== ENTER ) {
			return;
		}

		const {
			value,
			onChange,
			disableLineBreaks,
			onSplitAtEnd,
			onSplitAtDoubleLineEnd,
			registry,
		} = props.current;

		event.preventDefault();

		const { text, start, end } = value;

		// 🔹 Check double Enter (Mastodon style)
		const now = Date.now();
		if ( now - lastEnterTime < 300 ) {
			// Double Enter → new paragraph
			if ( onSplitAtEnd && start === end && end === text.length ) {
				onSplitAtEnd();
			} else if (
				onSplitAtDoubleLineEnd &&
				start === end &&
				end === text.length &&
				text.slice( -2 ) === '\n\n'
			) {
				registry.batch( () => {
					const _value = { ...value };
					_value.start = _value.end - 2;
					onChange( remove( _value ) );
					onSplitAtDoubleLineEnd();
				} );
			} else if ( ! disableLineBreaks ) {
				// fallback paragraph split
				onChange( insert( value, '\n\n' ) );
			}
		} else if ( event.shiftKey ) {
			// 🔹 Single Enter with Shift
			if ( ! disableLineBreaks ) {
				onChange( insert( value, '\n' ) );
			}
		} else if ( ! disableLineBreaks ) {
			// 🔹 Single Enter = line break
			onChange( insert( value, '\n' ) );
		}

		lastEnterTime = now;
	}

	const { defaultView } = element.ownerDocument;

	// Attach the listener to the window so parent elements have the chance to
	// prevent the default behavior.
	defaultView.addEventListener( 'keydown', onKeyDown );
	element.addEventListener( 'keydown', onKeyDownDeprecated );
	return () => {
		defaultView.removeEventListener( 'keydown', onKeyDown );
		element.removeEventListener( 'keydown', onKeyDownDeprecated );
	};
};
