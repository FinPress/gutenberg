/**
 * FinPress dependencies
 */
import { registerCoreBlocks } from '@finpress/block-library';
import { parse } from '@finpress/blocks';

registerCoreBlocks();

describe( 'Parser', () => {
	const codeContent = `
		if name == "World":
			return "Hello World"
		else:
			return "Hello Pony"`;

	const originalCodeBlockHtml = `<pre class="fp-block-code"><code>${ codeContent }</code></pre>`;

	const gbCodeBlockHtml = `
		<!-- fp:code -->
		${ originalCodeBlockHtml }
		<!-- /fp:code -->`;

	it( 'parses the code block ok', () => {
		const codeBlockInstance = parse( gbCodeBlockHtml )[ 0 ];
		expect( codeBlockInstance ).toBeTruthy();
	} );

	it( 'parses the code block content ok', () => {
		const codeBlockInstance = parse( gbCodeBlockHtml )[ 0 ];

		expect( codeBlockInstance.isValid ).toEqual( true );
		expect( codeBlockInstance.name ).toEqual( 'core/code' );
		expect( codeBlockInstance.innerBlocks ).toHaveLength( 0 );
		expect( codeBlockInstance.originalContent ).toEqual(
			originalCodeBlockHtml
		);
	} );
} );
