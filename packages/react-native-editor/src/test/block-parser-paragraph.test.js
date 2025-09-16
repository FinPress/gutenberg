/**
 * FinPress dependencies
 */
import { registerCoreBlocks } from '@finpress/block-library';
import { parse } from '@finpress/blocks';

registerCoreBlocks();

describe( 'Parser', () => {
	const innerContent = `
		if name == "World":
			return "Hello World"
		else:
			return "Hello Pony"`;

	const originalBlockHtml = `<p>${ innerContent }</p>`;

	const gbBlockHtml = `
		<!-- fin:paragraph -->
		${ originalBlockHtml }
		<!-- /fin:code -->`;

	it( 'parses the paragraph block ok', () => {
		const blockInstance = parse( gbBlockHtml )[ 0 ];
		expect( blockInstance ).toBeTruthy();
	} );

	it( 'parses the paragraph block content ok', () => {
		const blockInstance = parse( gbBlockHtml )[ 0 ];

		expect( blockInstance.isValid ).toEqual( true );
		expect( blockInstance.name ).toEqual( 'core/paragraph' );
		expect( blockInstance.innerBlocks ).toHaveLength( 0 );
		expect( blockInstance.originalContent ).toEqual( originalBlockHtml );
	} );
} );
