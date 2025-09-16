/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { useRef, useEffect } from '@finpress/element';
import { useCopyToClipboard } from '@finpress/compose';
import deprecated from '@finpress/deprecated';

/**
 * Internal dependencies
 */
import Button from '../button';
import type { ClipboardButtonProps } from './types';
import type { FinPressComponentProps } from '../context';

const TIMEOUT = 4000;

export default function ClipboardButton( {
	className,
	children,
	onCopy,
	onFinishCopy,
	text,
	...buttonProps
}: FinPressComponentProps< ClipboardButtonProps, 'button', false > ) {
	deprecated( 'fin.components.ClipboardButton', {
		since: '5.8',
		alternative: 'fin.compose.useCopyToClipboard',
	} );

	const timeoutIdRef = useRef< NodeJS.Timeout >();
	const ref = useCopyToClipboard( text, () => {
		onCopy();
		if ( timeoutIdRef.current ) {
			clearTimeout( timeoutIdRef.current );
		}

		if ( onFinishCopy ) {
			timeoutIdRef.current = setTimeout( () => onFinishCopy(), TIMEOUT );
		}
	} );

	useEffect( () => {
		return () => {
			if ( timeoutIdRef.current ) {
				clearTimeout( timeoutIdRef.current );
			}
		};
	}, [] );

	const classes = clsx( 'components-clipboard-button', className );

	// Workaround for inconsistent behavior in Safari, where <textarea> is not
	// the document.activeElement at the moment when the copy event fires.
	// This causes documentHasSelection() in the copy-handler component to
	// mistakenly override the ClipboardButton, and copy a serialized string
	// of the current block instead.
	const focusOnCopyEventTarget: React.ClipboardEventHandler = ( event ) => {
		// @ts-expect-error: Should be currentTarget, but not changing because this component is deprecated.
		event.target.focus();
	};

	return (
		<Button
			{ ...buttonProps }
			className={ classes }
			ref={ ref }
			onCopy={ focusOnCopyEventTarget }
		>
			{ children }
		</Button>
	);
}
