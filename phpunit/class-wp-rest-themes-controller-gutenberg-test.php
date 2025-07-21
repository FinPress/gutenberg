<?php

class WPRESTThemesControllerGutenbergTest extends WP_Test_REST_Controller_Testcase {
	/**
	 * Contributor user ID.
	 *
	 * @since 5.0.0
	 *
	 * @var int $contributor_id
	 */
	protected static $contributor_id;

	/**
	 * Admin user ID.
	 *
	 * @since 5.7.0
	 *
	 * @var int $admin_id
	 */
	protected static $admin_id;

	/**
	 * The REST API route for themes.
	 *
	 * @since 5.0.0
	 *
	 * @var string $themes_route
	 */
	protected static $themes_route = '/wp/v2/themes';

	/**
	 * @doesNotPerformAssertions
	 */
	public function test_context_param() {
		// Controller does not use get_context_param().
	}

	/**
	 * @doesNotPerformAssertions
	 */
	public function test_create_item() {
		// Controller does not implement create_item().
	}

	/**
	 * @doesNotPerformAssertions
	 */
	public function test_delete_item() {
		// Controller does not implement delete_item().
	}

	/**
	 * @doesNotPerformAssertions
	 */
	public function test_get_item() {
		// Controller does not implement get_item().
	}

	/**
	 * @doesNotPerformAssertions
	 */
	public function test_get_item_schema() {
		// Controller does not implement get_item_schema().
	}

	/**
	 * @doesNotPerformAssertions
	*/
	public function test_get_items() {
		// Controller does not implement get_items().
	}

	/**
	 * @doesNotPerformAssertions
	 */
	public function test_prepare_item() {
		// Controller does not implement prepare_item().
	}

	/**
	 * @doesNotPerformAssertions
	 */
	public function test_update_item() {
		// Controller does not implement update_item().
	}

		/**
	 * Set up class test fixtures.
	 *
	 * @since 5.0.0
	 *
	 * @param WP_UnitTest_Factory $factory WordPress unit test factory.
	 */
	public static function wpSetUpBeforeClass( WP_UnitTest_Factory $factory ) {
		self::$admin_id       = $factory->user->create(
			array(
				'role' => 'administrator',
			)
		);
		self::$contributor_id = $factory->user->create(
			array(
				'role' => 'contributor',
			)
		);
	}

	public function test_register_routes() {
		$themes_controller = new WP_REST_Themes_Controller_Gutenberg();
		$themes_controller->register_routes();

		$routes = rest_get_server()->get_routes();
		$this->assertArrayHasKey( self::$themes_route, $routes );
		$this->assertArrayHasKey( self::$themes_route . '/activate', $routes );
	}

	/**
	 * Test that the activate_theme_permissions_check method returns an error for users without switch_themes capability.
	 */
	public function test_activate_theme_permissions_check_returns_error_on_users_without_capability() {
		// TODO: move to setup
		$themes_controller = new WP_REST_Themes_Controller_Gutenberg();
		$themes_controller->register_routes();

		wp_set_current_user( self::$contributor_id );


		$request = new WP_REST_Request(
			'POST',
			self::$themes_route . '/activate',
		);
		$request->set_param( 'stylesheet', 'twentytwentyfive' );
		$response = rest_get_server()->dispatch( $request );

		$this->assertSame( 403, $response->get_status() );
	}
}
