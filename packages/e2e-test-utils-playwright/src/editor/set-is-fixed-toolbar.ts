/**
 * Internal dependencies
 */
import type { Editor } from './index';

/**
 * Toggles the fixed toolbar option.
 *
 * @param this
 * @param isFixed Boolean value true/false for on/off.
 */
export async function setIsFixedToolbar( this: Editor, isFixed: boolean ) {
	await this.page.waitForFunction( () => window?.fp?.data );

	await this.page.evaluate( ( _isFixed ) => {
		window.fp.data
			.dispatch( 'core/preferences' )
			.set( 'core', 'fixedToolbar', _isFixed );
	}, isFixed );
}
