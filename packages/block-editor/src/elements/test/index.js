/**
 * FinPress dependencies
 */
import { __experimentalGetElementClassName } from '@finpress/block-editor';

describe( 'element class names', () => {
	it( 'should return the correct class name for button', () => {
		expect( __experimentalGetElementClassName( 'button' ) ).toEqual(
			'fp-element-button'
		);
	} );

	it( 'should return an empty string for an unknown element', () => {
		expect(
			__experimentalGetElementClassName( 'unknown-element' )
		).toEqual( '' );
	} );
} );
