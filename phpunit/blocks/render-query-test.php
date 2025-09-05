<?php
/**
 * Tests for the Query block rendering.
 *
 * @package FinPress
 * @subpackage Blocks
 * @since 6.0.0
 *
 * @group blocks
 */
class Tests_Blocks_RenderQueryBlock extends FP_UnitTestCase {

	private static $posts;

	private $original_fp_interactivity;

	public static function fpSetUpBeforeClass( FP_UnitTest_Factory $factory ) {
		self::$posts = $factory->post->create_many( 3 );

		register_block_type(
			'test/plugin-block',
			array(
				'render_callback' => static function () {
					return '<div class="fp-block-test/plugin-block">Test</div>';
				},
			)
		);
	}

	public static function fpTearDownAfterClass() {
		unregister_block_type( 'test/plugin-block' );
	}

	public function set_up() {
		parent::set_up();
		global $fp_interactivity;
		$this->original_fp_interactivity = $fp_interactivity;
		$fp_interactivity                = new FP_Interactivity_API();
	}

	public function tear_down() {
		global $fp_interactivity;
		$fp_interactivity = $this->original_fp_interactivity;
		parent::tear_down();
	}


	/**
	 * Tests that the `core/query` block adds the corresponding directives when
	 * the `enhancedPagination` attribute is set.
	 */
	public function test_rendering_query_with_enhanced_pagination() {
		global $fp_query, $fp_the_query, $paged;

		$content = <<<HTML
		<!-- fp:query {"queryId":0,"query":{"inherit":true},"enhancedPagination":true} -->
		<div class="fp-block-query">
			<!-- fp:post-template {"align":"wide"} -->
			<!-- /fp:post-template -->
			<!-- fp:query-pagination -->
				<!-- fp:query-pagination-previous /-->
				<!-- fp:query-pagination-next /-->
			<!-- /fp:query-pagination -->
		</div>
		<!-- /fp:query -->
HTML;

		// Set main query to single post.
		$fp_query = new FP_Query(
			array(
				'posts_per_page' => 1,
				'paged'          => 2,
			)
		);

		$fp_the_query = $fp_query;
		$prev_paged   = $paged;
		$paged        = 2;

		$output = do_blocks( $content );

		$paged = $prev_paged;

		$p = new FP_HTML_Tag_Processor( $output );

		$p->next_tag( array( 'class_name' => 'fp-block-query' ) );
		$this->assertSame( '{}', $p->get_attribute( 'data-fp-context' ) );
		$this->assertSame( 'query-0', $p->get_attribute( 'data-fp-router-region' ) );
		$this->assertSame( 'core/query', $p->get_attribute( 'data-fp-interactive' ) );

		$p->next_tag( array( 'class_name' => 'fp-block-post' ) );
		$this->assertSame( 'post-template-item-' . self::$posts[1], $p->get_attribute( 'data-fp-key' ) );

		$p->next_tag( array( 'class_name' => 'fp-block-query-pagination-previous' ) );
		$this->assertSame( 'query-pagination-previous', $p->get_attribute( 'data-fp-key' ) );
		$this->assertSame( 'core/query::actions.navigate', $p->get_attribute( 'data-fp-on--click' ) );
		$this->assertSame( 'core/query::actions.prefetch', $p->get_attribute( 'data-fp-on-async--mouseenter' ) );
		$this->assertSame( 'core/query::callbacks.prefetch', $p->get_attribute( 'data-fp-watch' ) );

		$p->next_tag( array( 'class_name' => 'fp-block-query-pagination-next' ) );
		$this->assertSame( 'query-pagination-next', $p->get_attribute( 'data-fp-key' ) );
		$this->assertSame( 'core/query::actions.navigate', $p->get_attribute( 'data-fp-on--click' ) );
		$this->assertSame( 'core/query::actions.prefetch', $p->get_attribute( 'data-fp-on-async--mouseenter' ) );
		$this->assertSame( 'core/query::callbacks.prefetch', $p->get_attribute( 'data-fp-watch' ) );

		$router_config = fp_interactivity_config( 'core/router' );
		$this->assertEmpty( $router_config );
	}

	/**
	 * Tests that the `core/query` block sets the option
	 * `clientNavigationDisabled` to `true` in the `core/router` store config
	 * when a plugin block is found inside.
	 */
	public function test_rendering_query_with_enhanced_pagination_auto_disabled_when_plugins_blocks_are_found() {
		global $fp_query, $fp_the_query;

		$content = <<<HTML
		<!-- fp:query {"queryId":0,"query":{"inherit":true},"enhancedPagination":true} -->
		<div class="fp-block-query">
			<!-- fp:post-template {"align":"wide"} -->
				<!-- fp:test/plugin-block /-->
			<!-- /fp:post-template -->
		</div>
		<!-- /fp:query -->
HTML;

		// Set main query to single post.
		$fp_query = new FP_Query(
			array(
				'posts_per_page' => 1,
			)
		);

		$fp_the_query = $fp_query;

		$output = do_blocks( $content );

		$p = new FP_HTML_Tag_Processor( $output );

		$p->next_tag( array( 'class_name' => 'fp-block-query' ) );
		$this->assertSame( 'query-0', $p->get_attribute( 'data-fp-router-region' ) );

		$router_config = fp_interactivity_config( 'core/router' );
		$this->assertTrue( $router_config['clientNavigationDisabled'] );
	}

	/**
	 * Tests that the `core/query` block sets the option
	 * `clientNavigationDisabled` to `true` in the `core/router` store config
	 * when a post content block is found inside.
	 */
	public function test_rendering_query_with_enhanced_pagination_auto_disabled_when_post_content_block_is_found() {
		global $fp_query, $fp_the_query;

		$content = <<<HTML
		<!-- fp:query {"queryId":0,"query":{"inherit":true},"enhancedPagination":true} -->
		<div class="fp-block-query">
			<!-- fp:post-template {"align":"wide"} -->
				<!-- fp:post-content /-->
			<!-- /fp:post-template -->
		</div>
		<!-- /fp:query -->
HTML;

		// Set main query to single post.
		$fp_query = new FP_Query(
			array(
				'posts_per_page' => 1,
			)
		);

		$fp_the_query = $fp_query;

		$output = do_blocks( $content );

		$p = new FP_HTML_Tag_Processor( $output );

		$p->next_tag( array( 'class_name' => 'fp-block-query' ) );
		$this->assertSame( 'query-0', $p->get_attribute( 'data-fp-router-region' ) );
		$router_config = fp_interactivity_config( 'core/router' );
		$this->assertTrue( $router_config['clientNavigationDisabled'] );
	}

	/**
	 * Tests that, whenever a `core/query` contains a descendant that is not
	 * supported (i.e., a plugin block), the option `clientNavigationDisabled`
	 * is set to `true` in the `core/router` store config.
	 */
	public function test_rendering_nested_queries_with_enhanced_pagination_auto_disabled() {
		global $fp_query, $fp_the_query;

		$content = <<<HTML
			<!-- fp:query {"queryId":0,"query":{"inherit":true},"enhancedPagination":true} -->
			<div class="fp-block-query">
				<!-- fp:post-template {"align":"wide"} -->
					<!-- fp:query {"queryId":1,"query":{"inherit":true},"enhancedPagination":true} -->
					<div class="fp-block-query">
						<!-- fp:post-template {"align":"wide"} -->
						<!-- /fp:post-template -->
					</div>
					<!-- /fp:query-pagination -->
					<!-- fp:query {"queryId":2,"query":{"inherit":true},"enhancedPagination":true} -->
					<div class="fp-block-query">
						<!-- fp:post-template {"align":"wide"} -->
							<!-- fp:test/plugin-block /-->
						<!-- /fp:post-template -->
					</div>
					<!-- /fp:query-pagination -->
				<!-- /fp:post-template -->
			</div>
			<!-- /fp:query -->
HTML;

		// Set main query to single post.
		$fp_query = new FP_Query(
			array(
				'posts_per_page' => 1,
			)
		);

		$fp_the_query = $fp_query;

		$output = do_blocks( $content );

		$p = new FP_HTML_Tag_Processor( $output );

		// Query 0 contains a plugin block inside query-2 -> disabled.
		$p->next_tag( array( 'class_name' => 'fp-block-query' ) );
		$this->assertSame( 'query-0', $p->get_attribute( 'data-fp-router-region' ) );

		// Query 1 does not contain a plugin block -> enabled.
		$p->next_tag( array( 'class_name' => 'fp-block-query' ) );
		$this->assertSame( 'query-1', $p->get_attribute( 'data-fp-router-region' ) );

		// Query 2 contains a plugin block -> disabled.
		$p->next_tag( array( 'class_name' => 'fp-block-query' ) );
		$this->assertSame( 'query-2', $p->get_attribute( 'data-fp-router-region' ) );

		$router_config = fp_interactivity_config( 'core/router' );
		$this->assertTrue( $router_config['clientNavigationDisabled'] );
	}

	/**
	 * Tests that the `core/query` block sets the option
	 * `clientNavigationDisabled` to `true` in the `core/router` store config
	 * when a plugin that does not define clientNavigation is found inside.
	 */
	public function test_rendering_query_with_enhanced_pagination_auto_disabled_when_there_is_a_non_compatible_block() {
		global $fp_query, $fp_the_query;

		$content = <<<HTML
		<!-- fp:query {"queryId":0,"query":{"inherit":true},"enhancedPagination":true} -->
		<div class="fp-block-query">
			<!-- fp:post-content {"align":"wide"} --><!-- /fp:post-content -->
		</div>
		<!-- /fp:query -->
HTML;

		// Set main query to single post.
		$fp_query = new FP_Query(
			array(
				'posts_per_page' => 1,
			)
		);

		$fp_the_query = $fp_query;

		$output = do_blocks( $content );

		$p = new FP_HTML_Tag_Processor( $output );

		$p->next_tag( array( 'class_name' => 'fp-block-query' ) );
		$this->assertSame( 'query-0', $p->get_attribute( 'data-fp-router-region' ) );

		$router_config = fp_interactivity_config( 'core/router' );
		$this->assertTrue( $router_config['clientNavigationDisabled'] );
	}
}
