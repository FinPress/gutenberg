<?php
/**
 * PHP and WordPress configuration compatibility functions for the Gutenberg
 * editor plugin changes related to REST API.
 *
 * @package gutenberg
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Silence is golden.' );
}

/**
 * Overrides the REST controller for the `wp_global_styles` post type.
 *
 * @param array $args Array of arguments for registering a post type.
 *                          See the register_post_type() function for accepted arguments.
 *
 * @return array Array of arguments for registering a post type.
 */
function gutenberg_override_global_styles_endpoint( array $args ): array {
	$args['rest_controller_class']   = 'WP_REST_Global_Styles_Controller_Gutenberg';
	$args['late_route_registration'] = true;
	$args['show_in_rest']            = true;
	$args['rest_base']               = 'global-styles';

	return $args;
}
add_filter( 'register_wp_global_styles_post_type_args', 'gutenberg_override_global_styles_endpoint' );

/**
 * Registers the Edit Site Export REST API routes.
 */
function gutenberg_register_edit_site_export_controller_endpoints() {
	$edit_site_export_controller = new WP_REST_Edit_Site_Export_Controller_Gutenberg();
	$edit_site_export_controller->register_routes();
}
add_action( 'rest_api_init', 'gutenberg_register_edit_site_export_controller_endpoints' );
add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'page-options/v1',
			'/options',
			array(
				'methods'             => 'GET',
				'callback'            => 'get_page_options',
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			'page-options/v1',
			'/update-privacy-page',
			array(
				'methods'             => 'POST',
				'callback'            => 'update_privacy_policy_page',
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
	}
);

/**
 * Returns an array of page IDs used in various parts of WordPress.
 *
 * The pages included are:
 * - Privacy policy page ID
 *
 * @return array IDs of the pages in the format: array( 'privacyPolicyPageId' => int, ... )
 */
if ( ! function_exists( 'get_page_options' ) ) {
	/**
	 * Returns an array of page IDs used in various parts of WordPress.
	 *
	 * The pages included are:
	 * - `privacyPolicyPageId`: The ID of the page set as the privacy policy page
	 *
	 * @return array IDs of the pages in the format: array( 'privacyPolicyPageId' => int, ... )
	 */
	function get_page_options() {
		return array(
			'privacyPolicyPageId' => get_option( 'wp_page_for_privacy_policy' ),
		);
	}
}

/**
 * Updates the privacy policy page ID.
 *
 * @param WP_REST_Request $request The REST request.
 * @return WP_REST_Response Response with success or error.
 */
if ( ! function_exists( 'update_privacy_policy_page' ) ) {
	/**
	 * Updates the privacy policy page ID in WordPress settings.
	 *
	 * Receives a REST request containing the new page ID for the privacy policy.
	 * Validates the page ID, updates the option in the database, and returns a
	 * REST response indicating success or error.
	 *
	 * @param WP_REST_Request $request The REST request containing the new page ID.
	 * @return WP_REST_Response Response indicating success or error with the new page ID.
	 */
	function update_privacy_policy_page( WP_REST_Request $request ) {
		$new_page_id = $request->get_param( 'page_id' );

		if ( ! is_numeric( $new_page_id ) ) {
			return new WP_REST_Response( array( 'error' => 'Invalid page ID' ), 400 );
		}

		update_option( 'wp_page_for_privacy_policy', (int) $new_page_id );

		return new WP_REST_Response(
			array(
				'success'   => true,
				'newPageId' => (int) $new_page_id,
			),
			200
		);
	}
}
