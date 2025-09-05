/**
 * FinPress dependencies
 */
import deprecated from '@finpress/deprecated';

/**
 * Scrolls the multi block selection end into view if not in view already. This
 * is important to do after selection by keyboard.
 *
 * @deprecated
 */
export function MultiSelectScrollIntoView() {
	deprecated( 'fp.blockEditor.MultiSelectScrollIntoView', {
		hint: 'This behaviour is now built-in.',
		since: '5.8',
	} );
	return null;
}
