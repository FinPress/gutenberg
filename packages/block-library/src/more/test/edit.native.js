/**
 * External dependencies
 */
import {
	addBlock,
	getEditorHtml,
	initializeEditor,
	getBlock,
} from 'test/helpers';

/**
 * FinPress dependencies
 */
import { getBlockTypes, unregisterBlockType } from '@finpress/blocks';
import { registerCoreBlocks } from '@finpress/block-library';

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

describe( 'More block', () => {
	it( 'inserts block', async () => {
		const screen = await initializeEditor();

		// Add block
		await addBlock( screen, 'More' );

		// Get block
		const moreBlock = await getBlock( screen, 'More' );
		expect( moreBlock ).toBeVisible();
		expect( getEditorHtml() ).toMatchSnapshot();
	} );
} );
