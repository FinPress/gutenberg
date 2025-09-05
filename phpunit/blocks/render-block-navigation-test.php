<?php
/**
 * Navigation block rendering tests.
 *
 * @package FinPress
 * @subpackage Blocks
 */

/**
 * Tests for the Navigation block.
 *
 * @group blocks
 */
class Render_Block_Navigation_Test extends FP_UnitTestCase {
	/**
	 * @covers ::gutenberg_block_core_navigation_from_block_get_post_ids
	 */
	public function test_block_core_navigation_get_post_ids_from_block() {
		$parsed_blocks = parse_blocks(
			'<!-- fp:navigation-link {"label":"Sample Page","type":"page","kind":"post-type","id":755,"url":"http://' . FP_TESTS_DOMAIN . '/?page_id=755"} /-->'
		);
		$parsed_block  = $parsed_blocks[0];
		$context       = array();
		$block         = new FP_Block( $parsed_block, $context );

		$post_ids = gutenberg_block_core_navigation_from_block_get_post_ids( $block );
		$this->assertSameSets( array( 755 ), $post_ids );
	}

	/**
	 * @covers ::gutenberg_block_core_navigation_from_block_get_post_ids
	 */
	public function test_block_core_navigation_get_post_ids_from_block_nested() {
		$parsed_blocks = parse_blocks(
			'<!-- fp:group -->
					<!-- fp:navigation-link {"label":"Sample Page","type":"page","id":20,"url":"http://' . FP_TESTS_DOMAIN . '/?page_id=20","kind":"post-type","isTopLevelLink":true} /-->
					<!-- fp:navigation-link {"label":"Hello world!","type":"post","id":10,"url":"http://' . FP_TESTS_DOMAIN . '/?p=10","kind":"post-type","isTopLevelLink":true} /-->
					<!-- fp:navigation-submenu {"label":"Uncategorized","type":"category","id":1,"url":"http://' . FP_TESTS_DOMAIN . '/?cat=1","kind":"taxonomy","isTopLevelItem":true} -->
					<!-- fp:navigation-link {"label":"Sample Page","type":"page","id":30,"url":"http://' . FP_TESTS_DOMAIN . '/?page_id=30","kind":"post-type","isTopLevelLink":false} /-->
					<!-- fp:navigation-submenu {"label":"Hello world!","type":"post","id":40,"url":"http://' . FP_TESTS_DOMAIN . '/?p=40","kind":"post-type","isTopLevelItem":false} -->
					<!-- fp:navigation-link {"label":"Uncategorized","type":"category","id":5,"url":"http://' . FP_TESTS_DOMAIN . '/?cat=5","kind":"taxonomy","isTopLevelLink":false} /-->
					<!-- fp:navigation-link {"label":"Hello world!","type":"post","id":60,"url":"http:/' . FP_TESTS_DOMAIN . '/?p=60","kind":"post-type","isTopLevelLink":false} /-->
					<!-- /fp:navigation-submenu -->
					<!-- /fp:navigation-submenu -->
					<!-- /fp:group -->'
		);
		$parsed_block  = $parsed_blocks[0];
		$context       = array();
		$block         = new FP_Block( $parsed_block, $context );

		$post_ids = gutenberg_block_core_navigation_from_block_get_post_ids( $block );
		$this->assertSameSets( array( 40, 60, 10, 20, 30 ), $post_ids );
	}

	/**
	 * @covers ::gutenberg_block_core_navigation_from_block_get_post_ids
	 */
	public function test_block_core_navigation_get_post_ids_from_block_with_submenu() {
		$parsed_blocks = parse_blocks( '<!-- fp:navigation-submenu {"label":"Test","type":"post","id":789,"url":"http://' . FP_TESTS_DOMAIN . '/blog/test-3","kind":"post-type","isTopLevelItem":true} -->\n<!-- fp:navigation-link {"label":"(no title)","type":"post","id":755,"url":"http://' . FP_TESTS_DOMAIN . '/blog/755","kind":"post-type","isTopLevelLink":false} /-->\n<!-- /fp:navigation-submenu -->' );
		$parsed_block  = $parsed_blocks[0];
		$context       = array();
		$block         = new FP_Block( $parsed_block, $context );

		$post_ids = gutenberg_block_core_navigation_from_block_get_post_ids( $block );
		$this->assertSameSetsWithIndex( array( 755, 789 ), $post_ids );
	}

	/**
	 * @covers :: block_core_navigation_block_contains_core_navigation
	 */
	public function test_block_core_navigation_block_contains_core_navigation() {
		$parsed_blocks = parse_blocks( '<!-- fp:navigation /-->' );
		$inner_blocks  = new FP_Block_List( $parsed_blocks );
		$this->assertTrue( block_core_navigation_block_contains_core_navigation( $inner_blocks ) );
	}

	public function test_block_core_navigation_block_contains_core_navigation_deep() {
		$parsed_blocks = parse_blocks( '<!-- fp:group --><!-- /fp:group --><!-- fp:group --><!-- fp:group --><!-- fp:navigation /--><!-- /fp:group --><!-- /fp:group -->' );
		$inner_blocks  = new FP_Block_List( $parsed_blocks );
		$this->assertTrue( block_core_navigation_block_contains_core_navigation( $inner_blocks ) );
	}

	public function test_block_core_navigation_block_contains_core_navigation_no_navigation() {
		$parsed_blocks = parse_blocks( '<!-- fp:group --><!-- fp:group --><!-- /fp:group --><!-- /fp:group -->' );
		$inner_blocks  = new FP_Block_List( $parsed_blocks );
		$this->assertFalse( block_core_navigation_block_contains_core_navigation( $inner_blocks ) );
	}
}
