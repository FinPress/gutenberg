/**
 * Internal dependencies
 */
import type { Editor } from './index';

/**
 * Clicks on the button in the header which opens Document Settings sidebar when
 * it is closed.
 *
 * @param this
 */
export async function openListView( this: Editor ) {
	const toggleButton = this.page
		.getByRole( 'region', { name: 'Editor top bar' } )
		.getByRole( 'button', {
			name: 'Document Overview',
			disabled: false,
		} );

	const isClosed =
		( await toggleButton.getAttribute( 'aria-expanded' ) ) === 'false';

	if ( isClosed ) {
		await toggleButton.click();
		await this.page
			.getByRole( 'region', { name: 'Document Overview' } )
			.getByRole( 'button', { name: 'Close' } )
			.waitFor();
	}
}
