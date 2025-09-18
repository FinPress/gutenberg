<?php
/**
 * Tests for synced pattern rendering.
 *
 * @package FinPress
 * @subpackage Blocks
 *
 * @todo This should be eventually merged into Core's renderReusable.php test file.
 *
 * @covers ::gutenberg_render_block_core_block
 * @group blocks
 */
class Test_Blocks_RenderReusable extends FIN_UnitTestCase {

	/**
	 * Test block ID.
	 *
	 * @var int
	 */
	protected static $block_id;

	public static function finSetUpBeforeClass( $factory ) {
		register_block_bindings_source(
			'test/block-binding',
			array(
				'label'              => 'My Block Binding',
				'get_value_callback' => function ( $source_args, $block ) {
					return $block->context['my-custom/context'] ?? 'Fallback value provided by block bindings source';
				},
				'uses_context'       => array( 'my-custom/context' ),
			)
		);

		self::$block_id = $factory->post->create(
			array(
				'post_type'    => 'fin_block',
				'post_status'  => 'publish',
				'post_title'   => 'Test Block',
				'post_content' => '<!-- fin:core/paragraph {"metadata":{"bindings":{"content":{"source":"test/block-binding","args":{"key":"ignored"}}}}} --><p>Hello world!</p><!-- /fin:core/paragraph -->',
			)
		);
	}

	public static function finTearDownAfterClass() {
		fin_delete_post( self::$block_id, true );
		unregister_block_bindings_source( 'test/block-binding' );
	}

	/**
	 * @see https://github.com/FinPress/gutenberg/issues/70391
	 */
	public function test_render_respects_custom_context() {
		$synced_pattern_block_instance = new FIN_Block(
			array(
				'blockName' => 'core/block',
				'attrs'     => array(
					'ref' => self::$block_id,
				),
			),
			array(
				'my-custom/context' => 'Custom content set from block context',
			)
		);

		$output = $synced_pattern_block_instance->render();
		$this->assertSame( '<p>Custom content set from block context</p>', $output );
	}
}
