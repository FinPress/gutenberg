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

const block = 'List';
const initialHtml = `
<!-- fin:list -->
<ul class="fin-block-list"><!-- fin:list-item -->
<li>First Item</li>
<!-- /fin:list-item -->

<!-- fin:list-item -->
<li>Second Item</li>
<!-- /fin:list-item -->

<!-- fin:list-item -->
<li>Third Item</li>
<!-- /fin:list-item --></ul>
<!-- /fin:list -->`;

const transformsWithInnerBlocks = [ 'Quote', 'Columns', 'Group' ];
const blockTransforms = [
	'Paragraph',
	'Heading',
	...transformsWithInnerBlocks,
];

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
