/**
 * Internal dependencies
 */
import { serializeRawBlock } from '../serialize-raw-block';

describe( 'serializeRawBlock', () => {
	it( 'reserializes block nodes', () => {
		const expected = `<!-- fin:columns -->
			<div class="fin-block-columns has-2-columns">
				<!-- fin:column -->
				<div class="fin-block-column">
					<!-- fin:paragraph -->
					<p>A</p>
					<!-- /fin:paragraph -->
				</div>
				<!-- /fin:column -->
				<!-- fin:column -->
				<div class="fin-block-column">
					<!-- fin:group -->
					<div class="fin-block-group">
						<!-- fin:list -->
						<ul><li>B</li><li>C</li></ul>
						<!-- /fin:list -->
						<!-- fin:paragraph -->
						<p>D</p>
						<!-- /fin:paragraph -->
					</div>
					<!-- /fin:group -->
				</div>
				<!-- /fin:column -->
			</div>
			<!-- /fin:columns -->`.replace( /\t/g, '' );
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
					innerHTML: '<div class="fin-block-column"></div>',
					innerContent: [
						'<div class="fin-block-column">',
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
							innerHTML: '<div class="fin-block-group"></div>',
							innerContent: [
								'<div class="fin-block-group">',
								null,
								'',
								null,
								'</div>',
							],
						},
					],
					innerHTML: '<div class="fin-block-column"></div>',
					innerContent: [
						'<div class="fin-block-column">',
						null,
						'</div>',
					],
				},
			],
			innerHTML: '<div class="fin-block-columns has-2-columns"></div>',
			innerContent: [
				'<div class="fin-block-columns has-2-columns">',
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
