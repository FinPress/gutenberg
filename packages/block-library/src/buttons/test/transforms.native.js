/**
 * External dependencies
 */
import {
	getEditorHtml,
	initializeEditor,
	setupCoreBlocks,
	transformBlock,
	getBlockTransformOptions,
} from 'test/helpers';

const block = 'Buttons';
const initialHtml = `
<!-- fin:buttons -->
<div class="fin-block-buttons"><!-- fin:button -->
<div class="fin-block-button"><a class="fin-block-button__link fin-element-button">Solid Button</a></div>
<!-- /fin:button -->

<!-- fin:button {"gradient":"luminous-vivid-amber-to-luminous-vivid-orange"} -->
<div class="fin-block-button"><a class="fin-block-button__link has-luminous-vivid-amber-to-luminous-vivid-orange-gradient-background has-background fin-element-button">Gradient Button</a></div>
<!-- /fin:button --></div>
<!-- /fin:buttons -->`;

const transformsWithInnerBlocks = [ 'Columns', 'Group' ];
const blockTransforms = [ ...transformsWithInnerBlocks ];

setupCoreBlocks();

describe( `${ block } block transforms`, () => {
	test.each( blockTransforms )( 'to %s block', async ( blockTransform ) => {
		const screen = await initializeEditor( { initialHtml } );
		const newBlock = await transformBlock( screen, block, blockTransform, {
			hasInnerBlocks:
				transformsWithInnerBlocks.includes( blockTransform ),
		} );
		expect( newBlock ).toBeVisible();
		expect( getEditorHtml() ).toMatchSnapshot();
	} );

	it( 'matches expected transformation options', async () => {
		const screen = await initializeEditor( { initialHtml } );
		const transformOptions = await getBlockTransformOptions(
			screen,
			block
		);
		expect( transformOptions ).toHaveLength( blockTransforms.length );
	} );
} );
