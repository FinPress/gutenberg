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
<!-- fp:buttons -->
<div class="fp-block-buttons"><!-- fp:button -->
<div class="fp-block-button"><a class="fp-block-button__link fp-element-button">Solid Button</a></div>
<!-- /fp:button -->

<!-- fp:button {"gradient":"luminous-vivid-amber-to-luminous-vivid-orange"} -->
<div class="fp-block-button"><a class="fp-block-button__link has-luminous-vivid-amber-to-luminous-vivid-orange-gradient-background has-background fp-element-button">Gradient Button</a></div>
<!-- /fp:button --></div>
<!-- /fp:buttons -->`;

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
