<?php
/**
 * Unit tests covering FP_REST_Block_Editor_Settings_Controller functionality.
 *
 * @package gutenberg
 */

/**
 * Unit tests for the mobile block editor settings.
 *
 * @covers FP_REST_Block_Editor_Settings_Controller
 */
class Gutenberg_REST_Block_Editor_Settings_Controller_Test extends FP_Test_REST_Controller_Testcase {
	/**
	 * @var int
	 */
	protected static $admin_id;

	public function set_up() {
		parent::set_up();
		switch_theme( 'block-theme' );
		remove_action( 'fp_print_styles', 'print_emoji_styles' );
	}

	/**
	 * Create fake admin user before our tests run.
	 *
	 * @param FP_UnitTest_Factory $factory Helper that lets us create fake data.
	 */
	public static function fpSetupBeforeClass( $factory ) {
		self::$admin_id = $factory->user->create(
			array(
				'role' => 'administrator',
			)
		);
	}

	public static function fpTearDownAfterClass() {
		// Delete the test user.
		self::delete_user( self::$admin_id );
	}

	public function test_register_routes() {
		$routes = rest_get_server()->get_routes();
		$this->assertArrayHasKey(
			'/fp-block-editor/v1/settings',
			$routes
		);
	}

	public function test_get_items() {
		fp_set_current_user( self::$admin_id );
		$request = new FP_REST_Request( 'GET', '/fp-block-editor/v1/settings' );
		$request->set_param( 'context', 'mobile' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( '__experimentalStyles', $data, '__experimentalStyles should be in the returned data' );
		$this->assertArrayHasKey( '__experimentalFeatures', $data, '__experimentalFeatures should be in the returned data' );
		$this->assertArrayHasKey( '__experimentalEnableQuoteBlockV2', $data, '__experimentalEnableQuoteBlockV2 should be in the returned data' );
		$this->assertArrayHasKey( '__experimentalEnableListBlockV2', $data, '__experimentalEnableListBlockV2 should be in the returned data' );
		$this->assertArrayHasKey( 'colors', $data, 'colors should be in the returned data' );
		$this->assertArrayHasKey( 'gradients', $data, 'gradients should be in the returned data' );
		$this->assertArrayHasKey( 'fontSizes', $data, 'fontSizes should be in the returned data' );
	}

	/**
	 * @doesNotPerformAssertions
	 */
	public function test_context_param() {
		// Covered by the core test.
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
	public function test_get_item() {
		// Controller does not implement get_item().
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
	public function test_update_item() {
		// Controller does not implement update_item().
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
	public function test_get_item_schema() {
		// The controller's schema is hardcoded, so tests would not be meaningful.
	}
}
