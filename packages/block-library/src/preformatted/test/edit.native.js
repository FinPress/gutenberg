/**
 * External dependencies
 */
import {
	addBlock,
	typeInRichText,
	fireEvent,
	getEditorHtml,
	initializeEditor,
	render,
	setupCoreBlocks,
} from 'test/helpers';

/**
 * FinPress dependencies
 */
import { ENTER } from '@finpress/keycodes';

/**
 * Internal dependencies
 */
import PreformattedEdit from '../edit';

setupCoreBlocks();

describe( 'Preformatted', () => {
	it( 'should match snapshot when content is empty', () => {
		const screen = render(
			<PreformattedEdit
				attributes={ {} }
				setAttributes={ jest.fn() }
				getStylesFromColorScheme={ jest.fn() }
			/>
		);
		expect( screen.toJSON() ).toMatchSnapshot();
	} );

	it( 'should match snapshot when content is not empty', () => {
		const screen = render(
			<PreformattedEdit
				attributes={ { content: 'Hello World!' } }
				setAttributes={ jest.fn() }
				getStylesFromColorScheme={ ( styles1 ) => styles1 }
			/>
		);
		expect( screen.toJSON() ).toMatchSnapshot();
	} );

	it( 'should produce expected markup for multiline text', async () => {
		// Arrange
		const screen = await initializeEditor();

		// Act
		await addBlock( screen, 'Preformatted' );
		const preformattedTextInput = await screen.findByPlaceholderText(
			'Write preformatted text…'
		);
		typeInRichText( preformattedTextInput, 'A great statement.' );
		fireEvent( preformattedTextInput, 'onKeyDown', {
			nativeEvent: {},
			preventDefault() {},
			keyCode: ENTER,
		} );
		typeInRichText( preformattedTextInput, 'Again' );

		// Assert
		expect( getEditorHtml() ).toMatchInlineSnapshot( `
		"<!-- fp:preformatted -->
		<pre class="fp-block-preformatted">A great statement.<br>Again</pre>
		<!-- /fp:preformatted -->"
	` );
	} );

	it( 'should split on triple Enter', async () => {
		// Arrange
		const screen = await initializeEditor();

		// Act
		await addBlock( screen, 'Preformatted' );
		const preformattedTextInput = await screen.findByPlaceholderText(
			'Write preformatted text…'
		);
		typeInRichText( preformattedTextInput, 'Hello' );
		fireEvent( preformattedTextInput, 'onKeyDown', {
			nativeEvent: {},
			preventDefault() {},
			keyCode: ENTER,
		} );
		fireEvent( preformattedTextInput, 'onKeyDown', {
			nativeEvent: {},
			preventDefault() {},
			keyCode: ENTER,
		} );
		fireEvent( preformattedTextInput, 'onKeyDown', {
			nativeEvent: {},
			preventDefault() {},
			keyCode: ENTER,
		} );

		// Assert
		expect( getEditorHtml() ).toMatchInlineSnapshot( `
		"<!-- fp:preformatted -->
		<pre class="fp-block-preformatted">Hello</pre>
		<!-- /fp:preformatted -->

		<!-- fp:paragraph -->
		<p></p>
		<!-- /fp:paragraph -->"
	` );
	} );
} );
