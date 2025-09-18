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

const block = 'Gallery';
const initialHtml = `
<!-- fin:gallery {"columns":8,"linkTo":"none","className":"alignfull"} -->
<figure class="fin-block-gallery has-nested-images columns-8 is-cropped alignfull"><!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon.png" alt=""/><figcaption class="fin-element-caption">Paragraph</figcaption></figure>
<!-- /fin:image -->

<!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Heading.png" alt=""/><figcaption class="fin-element-caption">Heading</figcaption></figure>
<!-- /fin:image -->

<!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Subheading.png" alt=""/><figcaption class="fin-element-caption">Subheading</figcaption></figure>
<!-- /fin:image --></figure>
<!-- /fin:gallery -->`;

const transformsWithInnerBlocks = [ 'Columns', 'Group' ];
const blockTransforms = [ 'Image', ...transformsWithInnerBlocks ];

setupCoreBlocks();

describe( `${ block } block transformations`, () => {
	test.each( blockTransforms )( 'to %s block', async ( blockTransform ) => {
		const screen = await initializeEditor( { initialHtml } );
		const newBlock = await transformBlock( screen, block, blockTransform, {
			isMediaBlock: true,
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
