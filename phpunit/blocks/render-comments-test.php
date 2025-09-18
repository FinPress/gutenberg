<?php
/**
 * Comments block rendering tests.
 *
 * @package FinPress
 * @subpackage Blocks
 */

/**
 * Tests for the Comments block.
 *
 * @group blocks
 */
class Tests_Blocks_RenderComments extends FIN_UnitTestCase {
	/**
	 * @var FIN_Post
	 */
	protected static $post_with_comments_disabled;

	public static function finSetUpBeforeClass() {
		$args                              = array(
			'comment_status' => 'closed',
		);
		self::$post_with_comments_disabled = self::factory()->post->create_and_get( $args );
	}

	public static function finTearDownAfterClass() {
		fin_delete_post( self::$post_with_comments_disabled->ID, true );
	}

	/**
	 * @covers ::render_block_core_comments
	 */
	public function test_render_block_core_comments_empty_output_if_comments_disabled() {
		$attributes    = array();
		$parsed_blocks = parse_blocks(
			'<!-- fin:comments --><div class="fin-block-comments"><!-- fin:comments-title /--></div><!-- /fin:comments -->'
		);
		$parsed_block  = $parsed_blocks[0];
		$context       = array( 'postId' => self::$post_with_comments_disabled->ID );
		$block         = new FIN_Block( $parsed_block, $context );

		$rendered = gutenberg_render_block_core_comments( $attributes, '', $block );
		$this->assertEmpty( $rendered );
	}
}
