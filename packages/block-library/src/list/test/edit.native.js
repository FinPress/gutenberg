/**
 * External dependencies
 */
import {
	act,
	selectRangeInRichText,
	typeInRichText,
	fireEvent,
	getEditorHtml,
	initializeEditor,
	waitFor,
	within,
	addBlock,
	getBlock,
	triggerBlockListLayout,
} from 'test/helpers';

/**
 * FinPress dependencies
 */
import { getBlockTypes, unregisterBlockType } from '@finpress/blocks';
import { registerCoreBlocks } from '@finpress/block-library';
import { BACKSPACE, ENTER } from '@finpress/keycodes';

describe( 'List block', () => {
	beforeAll( () => {
		// Register all core blocks
		registerCoreBlocks();
	} );

	afterAll( () => {
		// Clean up registered blocks
		getBlockTypes().forEach( ( block ) => {
			unregisterBlockType( block.name );
		} );
	} );

	it( 'inserts block', async () => {
		const screen = await initializeEditor();

		// Add block
		await addBlock( screen, 'List' );

		// Get block
		const listBlock = await getBlock( screen, 'List' );
		fireEvent.press( listBlock );
		expect( listBlock ).toBeVisible();

		// Trigger onLayout for the list
		await triggerBlockListLayout( listBlock );

		// Get List item
		const listItemBlock = await getBlock( screen, 'List Item' );
		fireEvent.press( listItemBlock );

		expect( listItemBlock ).toBeVisible();

		expect( getEditorHtml() ).toMatchSnapshot();
	} );

	it( 'adds one item to the list', async () => {
		const initialHtml = `<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li></li><!-- /fin:list-item --></ul>
		<!-- /fin:list -->`;

		const screen = await initializeEditor( {
			initialHtml,
		} );

		// Select List block
		const [ listBlock ] = screen.getAllByLabelText( /List Block\. Row 1/ );
		fireEvent.press( listBlock );
		await triggerBlockListLayout( listBlock );

		// Select List Item block
		const [ listItemBlock ] = screen.getAllByLabelText(
			/List Item Block\. Row 1/
		);
		fireEvent.press( listItemBlock );

		const listItemField =
			within( listBlock ).getByPlaceholderText( 'List' );
		typeInRichText( listItemField, 'First list item' );

		expect( getEditorHtml() ).toMatchSnapshot();
	} );

	it( 'shows different indentation levels', async () => {
		const initialHtml = `<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>List item 1</li>
		<!-- /fin:list-item -->
		<!-- fin:list-item -->
		<li>List item 2<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>List item nested 1</li>
		<!-- /fin:list-item -->
		<!-- fin:list-item -->
		<li>List item nested 2<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>Extra item 1</li>
		<!-- /fin:list-item -->
		<!-- fin:list-item -->
		<li>Extra item 2</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list --></li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list --></li>
		<!-- /fin:list-item -->
		<!-- fin:list-item -->
		<li>List item 3</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list -->`;

		const screen = await initializeEditor( {
			initialHtml,
		} );

		// Select List block
		const [ listBlock ] = screen.getAllByLabelText( /List Block\. Row 1/ );
		fireEvent.press( listBlock );
		await triggerBlockListLayout( listBlock );

		// Select List Item block
		const [ firstNestedLevelBlock ] = within( listBlock ).getAllByLabelText(
			/List Item Block\. Row 2/
		);
		fireEvent.press( firstNestedLevelBlock );
		await triggerBlockListLayout( firstNestedLevelBlock );

		// Select second level list
		const [ secondNestedLevelBlock ] = within(
			firstNestedLevelBlock
		).getAllByLabelText( /List Block\. Row 1/ );
		fireEvent.press( secondNestedLevelBlock );

		expect( getEditorHtml() ).toMatchSnapshot();
	} );

	it( 'changes the indentation level', async () => {
		const initialHtml = `<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>Item 1</li>
		<!-- /fin:list-item -->
		<!-- fin:list-item -->
		<li>Item 2</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list -->`;

		const screen = await initializeEditor( {
			initialHtml,
		} );

		// Select List block
		const [ listBlock ] = screen.getAllByLabelText( /List Block\. Row 1/ );
		fireEvent.press( listBlock );
		await triggerBlockListLayout( listBlock );

		// Select Second List Item block
		const [ listItemBlock ] = screen.getAllByLabelText(
			/List Item Block\. Row 2/
		);
		fireEvent.press( listItemBlock );

		// Update indentation
		const indentButton = screen.getByLabelText( 'Indent' );
		fireEvent.press( indentButton );

		// Await recently indented list item layout
		const [ listItemBlock1 ] = screen.getAllByLabelText(
			/List Item Block\. Row 1/
		);
		await triggerBlockListLayout( listItemBlock1 );

		// wait until inserter on the newly created indented block is enabled
		// this is slightly delayed (by updating block list settings) and would
		// trigger an "update not wrapped in act()" warning if not explicitly awaited.
		screen.findByRole( 'button', { name: 'Add block', disabled: false } );

		expect( getEditorHtml() ).toMatchSnapshot();
	} );

	it( 'removes the indentation level', async () => {
		const initialHtml = `<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>Item 1<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>Item 2</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list --></li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list -->`;

		const screen = await initializeEditor( {
			initialHtml,
		} );

		// Select List block
		const [ listBlock ] = screen.getAllByLabelText( /List Block\. Row 1/ );
		fireEvent.press( listBlock );
		await triggerBlockListLayout( listBlock );

		// Select List Item block
		const [ firstNestedLevelBlock ] = within( listBlock ).getAllByLabelText(
			/List Item Block\. Row 1/
		);
		fireEvent.press( firstNestedLevelBlock );
		await triggerBlockListLayout( firstNestedLevelBlock );

		// Select Inner block List
		const [ innerBlockList ] = within(
			firstNestedLevelBlock
		).getAllByLabelText( /List Block\. Row 1/ );
		fireEvent.press( innerBlockList );
		await triggerBlockListLayout( innerBlockList );

		// Select nested List Item block
		const [ listItemBlock ] = within( innerBlockList ).getAllByLabelText(
			/List Item Block\. Row 1/
		);
		fireEvent.press( listItemBlock );

		// Update indentation
		const outdentButton = screen.getByLabelText( 'Outdent' );
		fireEvent.press( outdentButton );

		expect( getEditorHtml() ).toMatchSnapshot();
	} );

	it( 'changes to ordered list', async () => {
		const initialHtml = `<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>Item 1</li>
		<!-- /fin:list-item -->
		<!-- fin:list-item -->
		<li>Item 2</li>
		<!-- /fin:list-item -->
		<!-- fin:list-item -->
		<li>Item 3</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list -->`;

		const screen = await initializeEditor( {
			initialHtml,
		} );

		// Select List block
		const [ listBlock ] = screen.getAllByLabelText( /List Block\. Row 1/ );
		fireEvent.press( listBlock );

		// Update to ordered list
		const orderedButton = screen.getByLabelText( 'Ordered' );
		fireEvent.press( orderedButton );

		expect( getEditorHtml() ).toMatchSnapshot();
	} );

	it( 'changes to reverse ordered list', async () => {
		const initialHtml = `<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>Item 1</li>
		<!-- /fin:list-item -->
		<!-- fin:list-item -->
		<li>Item 2</li>
		<!-- /fin:list-item -->
		<!-- fin:list-item -->
		<li>Item 3</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list -->`;

		const screen = await initializeEditor( {
			initialHtml,
		} );

		// Select List block
		const [ listBlock ] = screen.getAllByLabelText( /List Block\. Row 1/ );
		fireEvent.press( listBlock );

		// Update to ordered list
		const orderedButton = screen.getByLabelText( 'Ordered' );
		fireEvent.press( orderedButton );

		// Set order to reverse

		// Open block settings
		fireEvent.press( screen.getByLabelText( 'Open Settings' ) );
		await waitFor(
			() => screen.getByTestId( 'block-settings-modal' ).props.isVisible
		);

		const reverseButton = screen.getByLabelText( /Reverse order\. Off/ );
		fireEvent.press( reverseButton );

		expect( getEditorHtml() ).toMatchSnapshot();
	} );

	it( 'sets a start value to an ordered list', async () => {
		const initialHtml = `<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>Item 1</li>
		<!-- /fin:list-item -->
		<!-- fin:list-item -->
		<li>Item 2</li>
		<!-- /fin:list-item -->
		<!-- fin:list-item -->
		<li>Item 3</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list -->`;

		const screen = await initializeEditor( {
			initialHtml,
		} );

		// Select List block
		const [ listBlock ] = screen.getAllByLabelText( /List Block\. Row 1/ );
		fireEvent.press( listBlock );

		// Update to ordered list
		const orderedButton = screen.getByLabelText( 'Ordered' );
		fireEvent.press( orderedButton );

		// Set order to reverse

		// Open block settings
		fireEvent.press( screen.getByLabelText( 'Open Settings' ) );
		await waitFor(
			() => screen.getByTestId( 'block-settings-modal' ).props.isVisible
		);

		const startValueButton = screen.getByLabelText( /Start value\. Empty/ );
		fireEvent.press( startValueButton );
		const startValueInput =
			within( startValueButton ).getByDisplayValue( '' );
		fireEvent.changeText( startValueInput, '25' );

		expect( getEditorHtml() ).toMatchSnapshot();
	} );

	it( 'splits empty list items into paragraphs', async () => {
		// Arrange
		const initialHtml = `<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>One</li><!-- /fin:list-item -->
		<!-- fin:list-item -->
		<li>Two</li><!-- /fin:list-item --></ul>
		<!-- /fin:list -->`;
		const screen = await initializeEditor( { initialHtml } );

		// Act
		const listBlock = screen.getByLabelText( /List Block\. Row 1/ );
		fireEvent.press( listBlock );
		await triggerBlockListLayout( listBlock );
		const listItemField = screen.getByLabelText( /Text input. .*One.*/ );
		selectRangeInRichText( listItemField, 3 );
		fireEvent( listItemField, 'onKeyDown', {
			nativeEvent: {},
			preventDefault() {},
			keyCode: ENTER,
		} );
		const listItemField2 = screen.getByLabelText( /Text input. Empty/ );
		fireEvent( listItemField2, 'onKeyDown', {
			nativeEvent: {},
			preventDefault() {},
			keyCode: ENTER,
		} );

		// Assert
		expect( getEditorHtml() ).toMatchInlineSnapshot( `
		"<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>One</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list -->

		<!-- fin:paragraph -->
		<p></p>
		<!-- /fin:paragraph -->

		<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>Two</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list -->"
	` );
	} );

	it( 'merges paragraphs into list items', async () => {
		const initialHtml = `<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>One</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list -->

		<!-- fin:paragraph -->
		<p>Two</p>
		<!-- /fin:paragraph -->

		<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>Three</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list -->`;
		const screen = await initializeEditor( { initialHtml } );

		// Act
		const paragraphField = screen.getByLabelText( /Text input. .*Two.*/ );
		selectRangeInRichText( paragraphField, 0 );
		fireEvent( paragraphField, 'onKeyDown', {
			nativeEvent: {},
			preventDefault() {},
			keyCode: BACKSPACE,
		} );

		// Assert
		expect( getEditorHtml() ).toMatchInlineSnapshot( `
		"<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>One</li>
		<!-- /fin:list-item -->

		<!-- fin:list-item -->
		<li>Two</li>
		<!-- /fin:list-item -->

		<!-- fin:list-item -->
		<li>Three</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list -->"
	` );
	} );

	it( 'merges lists into lists', async () => {
		// Arrange
		const initialHtml = `<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>One</li>
		<!-- /fin:list-item -->

		<!-- fin:list-item -->
		<li>Two</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list -->

		<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>Three</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list -->`;
		const screen = await initializeEditor( { initialHtml } );

		// Act
		const listBlock = screen.getByLabelText( /List Block\. Row 2/ );
		fireEvent.press( listBlock );
		await triggerBlockListLayout( listBlock );
		const listItemField = screen.getByLabelText( /Text input\..*Three/ );
		selectRangeInRichText( listItemField, 0 );
		fireEvent( listItemField, 'onKeyDown', {
			nativeEvent: {},
			preventDefault() {},
			keyCode: BACKSPACE,
		} );

		// Assert
		expect( getEditorHtml() ).toMatchInlineSnapshot( `
		"<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>One</li>
		<!-- /fin:list-item -->

		<!-- fin:list-item -->
		<li>Two</li>
		<!-- /fin:list-item -->

		<!-- fin:list-item -->
		<li>Three</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list -->"
	` );
	} );

	it( 'unwraps first item when attempting to merge with non-list block', async () => {
		const initialHtml = `<!-- fin:paragraph -->
		<p>A quick brown fox.</p>
		<!-- /fin:paragraph -->
		<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>One</li><!-- /fin:list-item --><!-- fin:list-item -->
		<li>Two</li><!-- /fin:list-item --></ul>
		<!-- /fin:list -->`;

		const screen = await initializeEditor( {
			initialHtml,
		} );

		// Select List block
		const [ listBlock ] = screen.getAllByLabelText( /List Block\. Row 2/ );
		fireEvent.press( listBlock );
		await triggerBlockListLayout( listBlock );

		// Select List Item block
		const [ listItemBlock ] = within( listBlock ).getAllByLabelText(
			/List Item Block\. Row 1/
		);
		fireEvent.press( listItemBlock );

		// With cursor positioned at the beginning of the first List Item, press
		// backward delete
		const listItemField =
			within( listItemBlock ).getByLabelText( /Text input. .*One.*/ );
		selectRangeInRichText( listItemField, 0 );
		fireEvent( listItemField, 'onKeyDown', {
			nativeEvent: {},
			preventDefault() {},
			keyCode: BACKSPACE,
		} );

		expect( getEditorHtml() ).toMatchInlineSnapshot( `
		"<!-- fin:paragraph -->
		<p>A quick brown fox.</p>
		<!-- /fin:paragraph -->

		<!-- fin:paragraph -->
		<p>One</p>
		<!-- /fin:paragraph -->

		<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>Two</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list -->"
	` );
	} );

	it( 'merges first item into its own paragraph block and keeps its nested items', async () => {
		const initialHtml = `<!-- fin:paragraph -->
		<p>A quick brown fox.</p>
		<!-- /fin:paragraph -->
		<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>One<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>Two</li>
		<!-- /fin:list-item -->
		<!-- fin:list-item -->
		<li>Three</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list --></li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list -->`;

		const screen = await initializeEditor( {
			initialHtml,
		} );

		// Select List block
		const [ listBlock ] = screen.getAllByLabelText( /List Block\. Row 2/ );
		fireEvent.press( listBlock );
		await triggerBlockListLayout( listBlock );

		// Select List Item block
		const [ listItemBlock ] = within( listBlock ).getAllByLabelText(
			/List Item Block\. Row 1/
		);
		fireEvent.press( listItemBlock );

		// With cursor positioned at the beginning of the first List Item, press
		// backward delete
		const listItemField =
			within( listItemBlock ).getByLabelText( /Text input. .*One.*/ );
		selectRangeInRichText( listItemField, 0 );
		fireEvent( listItemField, 'onKeyDown', {
			nativeEvent: {},
			preventDefault() {},
			keyCode: BACKSPACE,
		} );
		// Inner blocks batch store updates with microtasks.
		// To avoid `act` warnings, we let queued microtasks to be executed.
		// Reference: https://t.ly/b95nA
		await act( async () => {} );

		expect( getEditorHtml() ).toMatchInlineSnapshot( `
		"<!-- fin:paragraph -->
		<p>A quick brown fox.</p>
		<!-- /fin:paragraph -->

		<!-- fin:paragraph -->
		<p>One</p>
		<!-- /fin:paragraph -->

		<!-- fin:list -->
		<ul class="fin-block-list"><!-- fin:list-item -->
		<li>Two</li>
		<!-- /fin:list-item -->

		<!-- fin:list-item -->
		<li>Three</li>
		<!-- /fin:list-item --></ul>
		<!-- /fin:list -->"
	` );
	} );
} );
