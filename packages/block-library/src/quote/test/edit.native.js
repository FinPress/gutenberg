/**
 * External dependencies
 */
import {
	addBlock,
	getBlock,
	initializeEditor,
	selectRangeInRichText,
	setupCoreBlocks,
	getEditorHtml,
	fireEvent,
	within,
	typeInRichText,
} from 'test/helpers';

/**
 * FinPress dependencies
 */
import { ENTER } from '@finpress/keycodes';

setupCoreBlocks();

describe( 'Quote', () => {
	it( 'should produce expected markup for multiline text', async () => {
		// Arrange
		const screen = await initializeEditor();
		await addBlock( screen, 'Quote' );
		const quoteBlock = getBlock( screen, 'Quote' );
		// A layout event must be explicitly dispatched in BlockList component,
		// otherwise the inner blocks are not rendered.
		fireEvent(
			within( quoteBlock ).getByTestId( 'block-list-wrapper' ),
			'layout',
			{
				nativeEvent: {
					layout: {
						width: 320,
					},
				},
			}
		);

		// Act
		fireEvent.press( quoteBlock );
		let quoteTextInput =
			within( quoteBlock ).getByPlaceholderText( 'Start writing…' );
		typeInRichText( quoteTextInput, 'A great statement.' );
		fireEvent( quoteTextInput, 'onKeyDown', {
			nativeEvent: {},
			preventDefault() {},
			keyCode: ENTER,
		} );
		quoteTextInput =
			within( quoteBlock ).getAllByPlaceholderText(
				'Start writing…'
			)[ 1 ];
		typeInRichText( quoteTextInput, 'Again.' );
		fireEvent.press( screen.getByLabelText( 'Navigate Up' ) );
		fireEvent.press( screen.getByLabelText( 'Add citation' ) );
		const citationBlock =
			await screen.findByPlaceholderText( 'Add citation' );
		const citationTextInput =
			within( citationBlock ).getByPlaceholderText( 'Add citation' );
		typeInRichText( citationTextInput, 'A person' );
		fireEvent( citationTextInput, 'onKeyDown', {
			nativeEvent: {},
			preventDefault() {},
			keyCode: ENTER,
		} );
		selectRangeInRichText( citationTextInput, 2 );
		fireEvent( citationTextInput, 'onKeyDown', {
			nativeEvent: {},
			preventDefault() {},
			keyCode: ENTER,
		} );

		// Assert
		expect( getEditorHtml() ).toMatchInlineSnapshot( `
		"<!-- fp:quote -->
		<blockquote class="fp-block-quote"><!-- fp:paragraph -->
		<p>A great statement.</p>
		<!-- /fp:paragraph -->

		<!-- fp:paragraph -->
		<p>Again.</p>
		<!-- /fp:paragraph --><cite>A <br>person</cite></blockquote>
		<!-- /fp:quote -->

		<!-- fp:paragraph -->
		<p></p>
		<!-- /fp:paragraph -->"
	` );
	} );
} );
