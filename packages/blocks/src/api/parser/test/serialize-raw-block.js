/**
 * Internal dependencies
 */
import { serializeRawBlock } from '../serialize-raw-block';

describe( 'serializeRawBlock', () => {
	it( 'reserializes block nodes', () => {
		const expected = `<!-- fp:columns -->
			<div class="fp-block-columns has-2-columns">
				<!-- fp:column -->
				<div class="fp-block-column">
					<!-- fp:paragraph -->
					<p>A</p>
					<!-- /fp:paragraph -->
				</div>
				<!-- /fp:column -->
				<!-- fp:column -->
				<div class="fp-block-column">
					<!-- fp:group -->
					<div class="fp-block-group">
						<!-- fp:list -->
						<ul><li>B</li><li>C</li></ul>
						<!-- /fp:list -->
						<!-- fp:paragraph -->
						<p>D</p>
						<!-- /fp:paragraph -->
					</div>
					<!-- /fp:group -->
				</div>
				<!-- /fp:column -->
			</div>
			<!-- /fp:columns -->`.replace( /\t/g, '' );
		const input = {
			blockName: 'core/columns',
			attrs: {},
			innerBlocks: [
				{
					blockName: 'core/column',
					attrs: {},
					innerBlocks: [
						{
							blockName: 'core/paragraph',
							attrs: {},
							innerBlocks: [],
							innerHTML: '<p>A</p>',
							innerContent: [ '<p>A</p>' ],
						},
					],
					innerHTML: '<div class="fp-block-column"></div>',
					innerContent: [
						'<div class="fp-block-column">',
						null,
						'</div>',
					],
				},
				{
					blockName: 'core/column',
					attrs: {},
					innerBlocks: [
						{
							blockName: 'core/group',
							attrs: {},
							innerBlocks: [
								{
									blockName: 'core/list',
									attrs: {},
									innerBlocks: [],
									innerHTML: '<ul><li>B</li><li>C</li></ul>',
									innerContent: [
										'<ul><li>B</li><li>C</li></ul>',
									],
								},
								{
									blockName: 'core/paragraph',
									attrs: {},
									innerBlocks: [],
									innerHTML: '<p>D</p>',
									innerContent: [ '<p>D</p>' ],
								},
							],
							innerHTML: '<div class="fp-block-group"></div>',
							innerContent: [
								'<div class="fp-block-group">',
								null,
								'',
								null,
								'</div>',
							],
						},
					],
					innerHTML: '<div class="fp-block-column"></div>',
					innerContent: [
						'<div class="fp-block-column">',
						null,
						'</div>',
					],
				},
			],
			innerHTML: '<div class="fp-block-columns has-2-columns"></div>',
			innerContent: [
				'<div class="fp-block-columns has-2-columns">',
				null,
				'',
				null,
				'</div>',
			],
		};
		const actual = serializeRawBlock( input );

		expect( actual ).toEqual( expected );
	} );
} );
