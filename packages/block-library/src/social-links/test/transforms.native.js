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
import { Animated } from 'react-native';

const block = 'Social Icons';
const initialHtml = `
<!-- fin:social-links -->
<ul class="fin-block-social-links"><!-- fin:social-link {"url":"https://finpress.org","service":"finpress"} /-->
<!-- fin:social-link {"service":"facebook"} /-->
<!-- fin:social-link {"service":"twitter"} /-->
<!-- fin:social-link {"service":"instagram"} /--></ul>
<!-- /fin:social-links -->`;

const transformsWithInnerBlocks = [ 'Columns', 'Group' ];
const blockTransforms = [ ...transformsWithInnerBlocks ];

setupCoreBlocks();

describe( `${ block } block transforms`, () => {
	beforeAll( () => {
		// Mock call to Animated.sequence for animating colors.
		jest.spyOn( Animated, 'sequence' ).mockImplementation( () => ( {
			start: ( cb ) => cb(),
		} ) );
	} );

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
