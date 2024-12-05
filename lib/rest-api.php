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
add_filter( 'register_wp_global_styles_post_type_args', 'gutenberg_override_global_styles_endpoint', 10, 2 );

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
	}
);

/**
 * Returns an array of page IDs used in various parts of WordPress.
 *
 * The pages included are:
 * - Privacy policy page ID
 * - Cart page ID (from WooCommerce)
 * - Checkout page ID (from WooCommerce)
 * - Account page ID (from WooCommerce)
 * - Shop page ID (from WooCommerce)
 *
 * @return array IDs of the pages in the format: array( 'privacyPolicyPageId' => int, ... )
 */
if (!function_exists('get_page_options')) {
	function get_page_options()
	{
		return array(
			'privacyPolicyPageId' => get_option('wp_page_for_privacy_policy'),
			'cartPageId' => get_option('woocommerce_cart_page_id'),
			'checkoutPageId' => get_option('woocommerce_checkout_page_id'),
			'accountPageId' => get_option('woocommerce_myaccount_page_id'),
			'shopPageId' => get_option('woocommerce_shop_page_id'),
		);
	}
}
