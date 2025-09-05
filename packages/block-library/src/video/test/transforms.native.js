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

const block = 'Video';
const initialHtml = `
<!-- fp:video -->
<figure class="fp-block-video"><video controls src="https://i.cloudup.com/YtZFJbuQCE.mov"></video><figcaption class="fp-element-caption">Cloudup video</figcaption></figure>
<!-- /fp:video -->`;

const transformsWithInnerBlocks = [ 'Columns', 'Group' ];
const nonMediaTransforms = [ 'File' ];
const blockTransforms = [
	'Cover',
	'Media & Text',
	...transformsWithInnerBlocks,
	...nonMediaTransforms,
];

setupCoreBlocks();

describe( `${ block } block transforms`, () => {
	test.each( blockTransforms )( 'to %s block', async ( blockTransform ) => {
		const screen = await initializeEditor( { initialHtml } );
		const newBlock = await transformBlock( screen, block, blockTransform, {
			isMediaBlock: ! nonMediaTransforms.includes( blockTransform ),
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
