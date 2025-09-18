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
class Tests_Blocks_RenderQueryBlock extends FIN_UnitTestCase {

	private static $posts;

	private $original_fin_interactivity;

	public static function finSetUpBeforeClass( FIN_UnitTest_Factory $factory ) {
		self::$posts = $factory->post->create_many( 3 );

		register_block_type(
			'test/plugin-block',
			array(
				'render_callback' => static function () {
					return '<div class="fin-block-test/plugin-block">Test</div>';
				},
			)
		);
	}

	public static function finTearDownAfterClass() {
		unregister_block_type( 'test/plugin-block' );
	}

	public function set_up() {
		parent::set_up();
		global $fin_interactivity;
		$this->original_fin_interactivity = $fin_interactivity;
		$fin_interactivity                = new FIN_Interactivity_API();
	}

	public function tear_down() {
		global $fin_interactivity;
		$fin_interactivity = $this->original_fin_interactivity;
		parent::tear_down();
	}


	/**
	 * Tests that the `core/query` block adds the corresponding directives when
	 * the `enhancedPagination` attribute is set.
	 */
	public function test_rendering_query_with_enhanced_pagination() {
		global $fin_query, $fin_the_query, $paged;

		$content = <<<HTML
		<!-- fin:query {"queryId":0,"query":{"inherit":true},"enhancedPagination":true} -->
		<div class="fin-block-query">
			<!-- fin:post-template {"align":"wide"} -->
			<!-- /fin:post-template -->
			<!-- fin:query-pagination -->
				<!-- fin:query-pagination-previous /-->
				<!-- fin:query-pagination-next /-->
			<!-- /fin:query-pagination -->
		</div>
		<!-- /fin:query -->
HTML;

		// Set main query to single post.
		$fin_query = new FIN_Query(
			array(
				'posts_per_page' => 1,
				'paged'          => 2,
			)
		);

		$fin_the_query = $fin_query;
		$prev_paged   = $paged;
		$paged        = 2;

		$output = do_blocks( $content );

		$paged = $prev_paged;

		$p = new FIN_HTML_Tag_Processor( $output );

		$p->next_tag( array( 'class_name' => 'fin-block-query' ) );
		$this->assertSame( '{}', $p->get_attribute( 'data-fin-context' ) );
		$this->assertSame( 'query-0', $p->get_attribute( 'data-fin-router-region' ) );
		$this->assertSame( 'core/query', $p->get_attribute( 'data-fin-interactive' ) );

		$p->next_tag( array( 'class_name' => 'fin-block-post' ) );
		$this->assertSame( 'post-template-item-' . self::$posts[1], $p->get_attribute( 'data-fin-key' ) );

		$p->next_tag( array( 'class_name' => 'fin-block-query-pagination-previous' ) );
		$this->assertSame( 'query-pagination-previous', $p->get_attribute( 'data-fin-key' ) );
		$this->assertSame( 'core/query::actions.navigate', $p->get_attribute( 'data-fin-on--click' ) );
		$this->assertSame( 'core/query::actions.prefetch', $p->get_attribute( 'data-fin-on-async--mouseenter' ) );
		$this->assertSame( 'core/query::callbacks.prefetch', $p->get_attribute( 'data-fin-watch' ) );

		$p->next_tag( array( 'class_name' => 'fin-block-query-pagination-next' ) );
		$this->assertSame( 'query-pagination-next', $p->get_attribute( 'data-fin-key' ) );
		$this->assertSame( 'core/query::actions.navigate', $p->get_attribute( 'data-fin-on--click' ) );
		$this->assertSame( 'core/query::actions.prefetch', $p->get_attribute( 'data-fin-on-async--mouseenter' ) );
		$this->assertSame( 'core/query::callbacks.prefetch', $p->get_attribute( 'data-fin-watch' ) );

		$router_config = fin_interactivity_config( 'core/router' );
		$this->assertEmpty( $router_config );
	}

	/**
	 * Tests that the `core/query` block sets the option
	 * `clientNavigationDisabled` to `true` in the `core/router` store config
	 * when a plugin block is found inside.
	 */
	public function test_rendering_query_with_enhanced_pagination_auto_disabled_when_plugins_blocks_are_found() {
		global $fin_query, $fin_the_query;

		$content = <<<HTML
		<!-- fin:query {"queryId":0,"query":{"inherit":true},"enhancedPagination":true} -->
		<div class="fin-block-query">
			<!-- fin:post-template {"align":"wide"} -->
				<!-- fin:test/plugin-block /-->
			<!-- /fin:post-template -->
		</div>
		<!-- /fin:query -->
HTML;

		// Set main query to single post.
		$fin_query = new FIN_Query(
			array(
				'posts_per_page' => 1,
			)
		);

		$fin_the_query = $fin_query;

		$output = do_blocks( $content );

		$p = new FIN_HTML_Tag_Processor( $output );

		$p->next_tag( array( 'class_name' => 'fin-block-query' ) );
		$this->assertSame( 'query-0', $p->get_attribute( 'data-fin-router-region' ) );

		$router_config = fin_interactivity_config( 'core/router' );
		$this->assertTrue( $router_config['clientNavigationDisabled'] );
	}

	/**
	 * Tests that the `core/query` block sets the option
	 * `clientNavigationDisabled` to `true` in the `core/router` store config
	 * when a post content block is found inside.
	 */
	public function test_rendering_query_with_enhanced_pagination_auto_disabled_when_post_content_block_is_found() {
		global $fin_query, $fin_the_query;

		$content = <<<HTML
		<!-- fin:query {"queryId":0,"query":{"inherit":true},"enhancedPagination":true} -->
		<div class="fin-block-query">
			<!-- fin:post-template {"align":"wide"} -->
				<!-- fin:post-content /-->
			<!-- /fin:post-template -->
		</div>
		<!-- /fin:query -->
HTML;

		// Set main query to single post.
		$fin_query = new FIN_Query(
			array(
				'posts_per_page' => 1,
			)
		);

		$fin_the_query = $fin_query;

		$output = do_blocks( $content );

		$p = new FIN_HTML_Tag_Processor( $output );

		$p->next_tag( array( 'class_name' => 'fin-block-query' ) );
		$this->assertSame( 'query-0', $p->get_attribute( 'data-fin-router-region' ) );
		$router_config = fin_interactivity_config( 'core/router' );
		$this->assertTrue( $router_config['clientNavigationDisabled'] );
	}

	/**
	 * Tests that, whenever a `core/query` contains a descendant that is not
	 * supported (i.e., a plugin block), the option `clientNavigationDisabled`
	 * is set to `true` in the `core/router` store config.
	 */
	public function test_rendering_nested_queries_with_enhanced_pagination_auto_disabled() {
		global $fin_query, $fin_the_query;

		$content = <<<HTML
			<!-- fin:query {"queryId":0,"query":{"inherit":true},"enhancedPagination":true} -->
			<div class="fin-block-query">
				<!-- fin:post-template {"align":"wide"} -->
					<!-- fin:query {"queryId":1,"query":{"inherit":true},"enhancedPagination":true} -->
					<div class="fin-block-query">
						<!-- fin:post-template {"align":"wide"} -->
						<!-- /fin:post-template -->
					</div>
					<!-- /fin:query-pagination -->
					<!-- fin:query {"queryId":2,"query":{"inherit":true},"enhancedPagination":true} -->
					<div class="fin-block-query">
						<!-- fin:post-template {"align":"wide"} -->
							<!-- fin:test/plugin-block /-->
						<!-- /fin:post-template -->
					</div>
					<!-- /fin:query-pagination -->
				<!-- /fin:post-template -->
			</div>
			<!-- /fin:query -->
HTML;

		// Set main query to single post.
		$fin_query = new FIN_Query(
			array(
				'posts_per_page' => 1,
			)
		);

		$fin_the_query = $fin_query;

		$output = do_blocks( $content );

		$p = new FIN_HTML_Tag_Processor( $output );

		// Query 0 contains a plugin block inside query-2 -> disabled.
		$p->next_tag( array( 'class_name' => 'fin-block-query' ) );
		$this->assertSame( 'query-0', $p->get_attribute( 'data-fin-router-region' ) );

		// Query 1 does not contain a plugin block -> enabled.
		$p->next_tag( array( 'class_name' => 'fin-block-query' ) );
		$this->assertSame( 'query-1', $p->get_attribute( 'data-fin-router-region' ) );

		// Query 2 contains a plugin block -> disabled.
		$p->next_tag( array( 'class_name' => 'fin-block-query' ) );
		$this->assertSame( 'query-2', $p->get_attribute( 'data-fin-router-region' ) );

		$router_config = fin_interactivity_config( 'core/router' );
		$this->assertTrue( $router_config['clientNavigationDisabled'] );
	}

	/**
	 * Tests that the `core/query` block sets the option
	 * `clientNavigationDisabled` to `true` in the `core/router` store config
	 * when a plugin that does not define clientNavigation is found inside.
	 */
	public function test_rendering_query_with_enhanced_pagination_auto_disabled_when_there_is_a_non_compatible_block() {
		global $fin_query, $fin_the_query;

		$content = <<<HTML
		<!-- fin:query {"queryId":0,"query":{"inherit":true},"enhancedPagination":true} -->
		<div class="fin-block-query">
			<!-- fin:post-content {"align":"wide"} --><!-- /fin:post-content -->
		</div>
		<!-- /fin:query -->
HTML;

		// Set main query to single post.
		$fin_query = new FIN_Query(
			array(
				'posts_per_page' => 1,
			)
		);

		$fin_the_query = $fin_query;

		$output = do_blocks( $content );

		$p = new FIN_HTML_Tag_Processor( $output );

		$p->next_tag( array( 'class_name' => 'fin-block-query' ) );
		$this->assertSame( 'query-0', $p->get_attribute( 'data-fin-router-region' ) );

		$router_config = fin_interactivity_config( 'core/router' );
		$this->assertTrue( $router_config['clientNavigationDisabled'] );
	}
}
