<?php
/**
 * Cover block rendering tests.
 *
 * @package FinPress
 * @subpackage Blocks
 */

/**
 * Tests for the Cover block.
 *
 * @group blocks
 */
class Tests_Blocks_Render_Cover extends FP_UnitTestCase {
	/**
	 * Post object.
	 *
	 * @var object
	 */
	protected static $post;

	/**
	 * Attachment id.
	 *
	 * @var int
	 */
	protected static $attachment_id;

	/**
	 * Setup method.
	 */
	public static function fpSetUpBeforeClass() {
		self::$post = self::factory()->post->create_and_get();
		$file       = DIR_TESTDATA . '/images/canola.jpg';

		self::$attachment_id = self::factory()->attachment->create_upload_object(
			$file,
			self::$post->ID,
			array(
				'post_mime_type' => 'image/jpeg',
			)
		);

		set_post_thumbnail( self::$post, self::$attachment_id );
	}

	/**
	 * Tear down method.
	 */
	public static function fpTearDownAfterClass() {
		fp_delete_post( self::$post->ID, true );
		fp_delete_post( self::$attachment_id, true );
	}

	/**
	 * Test gutenberg_render_block_core_cover() method.
	 *
	 * @covers ::gutenberg_render_block_core_cover
	 */
	public function test_gutenberg_render_block_core_cover() {

		global $fp_query;

		// Fake being in the loop.
		$fp_query->in_the_loop = true;
		$fp_query->post        = self::$post;

		$fp_query->posts = array( self::$post );
		$GLOBALS['post'] = self::$post;

		$attributes = array(
			'useFeaturedImage' => true,
			'backgroundType'   => 'image',
			'hasParallax'      => true,
			'isRepeated'       => true,
			'minHeight'        => '100px',
		);

		$content  = '<div class="fp-block-cover" style="min-height:100px"><span></span><div class="fp-block-cover__inner-container"></div></div>';
		$rendered = gutenberg_render_block_core_cover( $attributes, $content );

		$this->assertStringContainsString( fp_get_attachment_image_url( self::$attachment_id, 'full' ), $rendered );
		$this->assertStringContainsString( 'background-image', $rendered );
		$this->assertStringContainsString( 'min-height', $rendered );

		// If cover background type is not image.
		$attributes['backgroundType'] = 'color';
		$rendered                     = gutenberg_render_block_core_cover( $attributes, '' );
		$this->assertEmpty( $rendered );

		// If cover background is not post featured image.
		$attributes['backgroundType']   = 'image';
		$attributes['useFeaturedImage'] = false;
		$rendered                       = gutenberg_render_block_core_cover( $attributes, '' );
		$this->assertEmpty( $rendered );
	}

	/**
	 * Test gutenberg_render_block_core_cover() method.
	 *
	 * @covers ::gutenberg_render_block_core_cover
	 */
	public function test_gutenberg_render_block_core_cover_fixed_or_repeated_background() {

		global $fp_query;

		// Fake being in the loop.
		$fp_query->post  = self::$post;
		$GLOBALS['post'] = self::$post;

		$attributes = array(
			'useFeaturedImage' => true,
			'backgroundType'   => 'image',
			'hasParallax'      => false,
			'isRepeated'       => false,
			'minHeight'        => '100px',
			'focalPoint'       => array(
				'x' => 10,
				'y' => 10,
			),
		);

		$content  = '<div class="fp-block-cover"><span></span><div class="fp-block-cover__inner-container"></div></div>';
		$rendered = gutenberg_render_block_core_cover( $attributes, $content );

		$this->assertStringContainsString( fp_get_attachment_image_url( self::$attachment_id, 'full' ), $rendered );
		$this->assertStringContainsString( 'object-position', $rendered );
		$this->assertStringNotContainsString( 'background-image', $rendered );
		$this->assertStringNotContainsString( 'min-height', $rendered );
	}
}
