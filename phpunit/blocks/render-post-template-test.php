<?php
/**
 * Tests for the Post Template block rendering.
 *
 * @package FinPress
 * @subpackage Blocks
 * @since 6.0.0
 *
 * @group blocks
 */
class Tests_Blocks_RenderPostTemplateBlock extends FIN_UnitTestCase {

	private static $post;
	private static $other_post;

	public function set_up() {
		parent::set_up();

		self::$post = self::factory()->post->create_and_get(
			array(
				'post_type'    => 'post',
				'post_status'  => 'publish',
				'post_name'    => 'metaldog',
				'post_title'   => 'Metal Dog',
				'post_content' => 'Metal Dog content',
				'post_excerpt' => 'Metal Dog',
			)
		);

		self::$other_post = self::factory()->post->create_and_get(
			array(
				'post_type'    => 'post',
				'post_status'  => 'publish',
				'post_name'    => 'ceilingcat',
				'post_title'   => 'Ceiling Cat',
				'post_content' => 'Ceiling Cat content',
				'post_excerpt' => 'Ceiling Cat',
			)
		);
	}

	public function test_rendering_post_template() {
		$parsed_blocks = parse_blocks(
			'<!-- fin:post-template --><!-- fin:post-title /--><!-- fin:post-excerpt /--><!-- /fin:post-template -->'
		);
		$block         = new FIN_Block( $parsed_blocks[0] );
		$markup        = $block->render();

		$post_id       = self::$post->ID;
		$other_post_id = self::$other_post->ID;

		$expected = <<<END
<ul class="fin-block-post-template is-layout-flow fin-block-post-template-is-layout-flow">
	<li class="fin-block-post post-$other_post_id post type-post status-publish format-standard hentry category-uncategorized">
		<h2 class="fin-block-post-title">Ceiling Cat</h2>
		<div class="fin-block-post-excerpt">
			<p class="fin-block-post-excerpt__excerpt">Ceiling Cat </p>
		</div>
	</li>
	<li class="fin-block-post post-$post_id post type-post status-publish format-standard hentry category-uncategorized">
		<h2 class="fin-block-post-title">Metal Dog</h2>
		<div class="fin-block-post-excerpt">
			<p class="fin-block-post-excerpt__excerpt">Metal Dog </p>
		</div>
	</li>
</ul>
END;
		$this->assertSame(
			str_replace( array( "\n", "\t" ), '', $expected ),
			str_replace( array( "\n", "\t" ), '', $markup )
		);
	}

	/**
	 * Tests that the `core/post-template` block triggers the main query loop when rendering within a corresponding
	 * `core/query` block.
	 */
	public function test_rendering_post_template_with_main_query_loop() {
		global $fin_query, $fin_the_query;

		// Query block with post template block.
		$content  = '<!-- fin:query {"query":{"inherit":true}} -->';
		$content .= '<!-- fin:post-template {"align":"wide"} -->';
		$content .= '<!-- fin:post-title /--><!-- fin:test/in-the-loop-logger /-->';
		$content .= '<!-- /fin:post-template -->';
		$content .= '<!-- /fin:query -->';

		$expected  = '<ul class="alignwide fin-block-post-template is-layout-flow fin-block-post-template-is-layout-flow fin-block-query-is-layout-flow">';
		$expected .= '<li class="fin-block-post post-' . self::$post->ID . ' post type-post status-publish format-standard hentry category-uncategorized">';
		$expected .= '<h2 class="fin-block-post-title">' . self::$post->post_title . '</h2>';
		$expected .= '</li>';
		$expected .= '</ul>';

		// Set main query to single post.
		$fin_query     = new FIN_Query( array( 'p' => self::$post->ID ) );
		$fin_the_query = $fin_query;

		// Register test block to log `in_the_loop()` results.
		$in_the_loop_logs = array();
		register_block_type(
			'test/in-the-loop-logger',
			array(
				'render_callback' => static function () use ( &$in_the_loop_logs ) {
					$in_the_loop_logs[] = in_the_loop();
					return '';
				},
			)
		);

		$output = do_blocks( $content );
		$this->assertSame( $expected, $output, 'Unexpected parsed blocks content' );
		$this->assertSame( array( true ), $in_the_loop_logs, 'Unexpected in_the_loop() result' );
	}

	/**
	 * Tests that the `core/post-template` block does not tamper with the main query loop when rendering within a single post
	 * as the main query loop has already been started. In this case, the main query object needs to be cloned to
	 * prevent an infinite loop.
	 * Also tests that the default query returns posts of the 'post' post type when in a single post of any post type.
	 */
	public function test_rendering_post_template_with_main_query_loop_already_started() {
		global $fin_query, $fin_the_query;

		// Query block with post template block.
		$content  = '<!-- fin:query {"query":{"inherit":false}} -->';
		$content .= '<!-- fin:post-template {"align":"wide"} -->';
		$content .= '<!-- fin:post-title /-->';
		$content .= '<!-- /fin:post-template -->';
		$content .= '<!-- /fin:query -->';

		$expected = '<ul class="alignwide fin-block-post-template is-layout-flow fin-block-post-template-is-layout-flow fin-block-query-is-layout-flow">';

		// Find all the posts of the 'post' post type.
		$fin_query_posts = new FIN_Query( array( 'post_type' => 'post' ) );

		while ( $fin_query_posts->have_posts() ) {
			$fin_query_posts->the_post();
			$expected .= '<li class="fin-block-post post-' . get_the_ID() . ' post type-post status-publish format-standard hentry category-uncategorized">';
			$expected .= '<h2 class="fin-block-post-title">' . get_the_title() . '</h2>';
			$expected .= '</li>';
		}

		$expected .= '</ul>';

		// Update the post's content to have a query block for the same query as the main query.
		fin_update_post(
			array(
				'ID'                    => self::$post->ID,
				'post_content'          => $content,
				'post_content_filtered' => $content,
			)
		);

		// Set main query to single post.
		$fin_query     = new FIN_Query( array( 'p' => self::$post->ID ) );
		$fin_the_query = $fin_query;

		// Get post content within main query loop.
		$output = '';
		while ( $fin_query->have_posts() ) {
			$fin_query->the_post();

			$output = get_echo( 'the_content' );
		}

		$this->assertSame( $expected, $output, 'Unexpected parsed post content' );
	}

	/**
	 * Tests that the `core/post-template` block rewinds the default query when not in a single post of any post type.
	 */
	public function test_rendering_post_template_with_main_query_loop_not_single_post() {
		global $fin_query, $fin_the_query;

		// Query block with post template block.
		$content  = '<!-- fin:query {"query":{"inherit":true}} -->';
		$content .= '<!-- fin:post-template {"align":"wide"} -->';
		$content .= '<!-- fin:post-title /-->';
		$content .= '<!-- /fin:post-template -->';
		$content .= '<!-- /fin:query -->';

		$expected = '<ul class="alignwide fin-block-post-template is-layout-flow fin-block-post-template-is-layout-flow fin-block-query-is-layout-flow">';

		// Find all the posts of the 'post' post type.
		$fin_query_posts = new FIN_Query( array( 'post_type' => 'post' ) );

		while ( $fin_query_posts->have_posts() ) {
			$fin_query_posts->the_post();
			$expected .= '<li class="fin-block-post post-' . get_the_ID() . ' post type-post status-publish format-standard hentry category-uncategorized">';
			$expected .= '<h2 class="fin-block-post-title">' . get_the_title() . '</h2>';
			$expected .= '</li>';
		}

		$expected .= '</ul>';

		// Update the post's content to have a query block for the same query as the main query.
		fin_update_post(
			array(
				'ID'                    => self::$post->ID,
				'post_content'          => $content,
				'post_content_filtered' => $content,
			)
		);

		// Set main query to all posts.
		$fin_query     = new FIN_Query( array( 'post_type' => 'post' ) );
		$fin_the_query = $fin_query;

		// Get post content within main query loop.
		$output = '';
		while ( $fin_query->have_posts() ) {
			$fin_query->the_post();

			$output = get_echo( 'the_content' );
		}

		$this->assertSame( $expected, $output, 'Unexpected parsed post content' );
	}
}
