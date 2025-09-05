/**
 * External dependencies
 */
import {
	addBlock,
	fireEvent,
	getEditorHtml,
	initializeEditor,
	within,
	getBlock,
} from 'test/helpers';

/**
 * FinPress dependencies
 */
import { getBlockTypes, unregisterBlockType } from '@finpress/blocks';
import { registerCoreBlocks } from '@finpress/block-library';

const NESTED_GROUP_BLOCK = `<!-- fp:group {"layout":{"type":"constrained"}} -->
<div class="fp-block-group"><!-- fp:image -->
<figure class="fp-block-image"><img alt=""/></figure>
<!-- /fp:image -->
<!-- fp:group {"layout":{"type":"constrained"}} -->
<div class="fp-block-group"><!-- fp:spacer -->
<div style="height:100px" aria-hidden="true" class="fp-block-spacer"></div>
<!-- /fp:spacer --></div>
<!-- /fp:group --></div>
<!-- /fp:group -->`;

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

describe( 'Group block', () => {
	it( 'inserts block and adds a Heading block as an inner block', async () => {
		const screen = await initializeEditor();

		// Add block
		await addBlock( screen, 'Group' );

		// Get block
		const groupBlock = await getBlock( screen, 'Group' );
		fireEvent.press( groupBlock );

		// Append a block in the Group block
		const appenderButton =
			within( groupBlock ).getByTestId( 'appender-button' );
		fireEvent.press( appenderButton );

		// Look for a block in the inserter
		const blockList = screen.getByTestId( 'InserterUI-Blocks' );

		// onScroll event used to force the FlatList to render all items
		fireEvent.scroll( blockList, {
			nativeEvent: {
				contentOffset: { y: 0, x: 0 },
				contentSize: { width: 100, height: 100 },
				layoutMeasurement: { width: 100, height: 100 },
			},
		} );

		// Add a block
		fireEvent.press( await screen.findByText( 'Heading' ) );

		expect( getEditorHtml() ).toMatchSnapshot();
	} );

	it( 'ungroups inner blocks', async () => {
		const screen = await initializeEditor( {
			initialHtml: NESTED_GROUP_BLOCK,
		} );
		const { getByLabelText } = screen;

		// Get block
		let groupBlock = await getBlock( screen, 'Group' );
		fireEvent.press( groupBlock );

		// Get Ungroup button
		let ungroupButton = getByLabelText( /Ungroup/ );
		fireEvent.press( ungroupButton );

		// Press Group block again
		groupBlock = await getBlock( screen, 'Group', { rowIndex: 2 } );
		fireEvent.press( groupBlock );

		// Ungroup last block
		ungroupButton = getByLabelText( /Ungroup/ );
		fireEvent.press( ungroupButton );

		expect( getEditorHtml() ).toMatchSnapshot();
	} );
} );
