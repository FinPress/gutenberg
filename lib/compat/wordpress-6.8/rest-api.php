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

if ( ! function_exists( 'gutenberg_add_post_type_rendering_mode' ) ) {
	/**
	 * Add Block Editor default rendering mode to the post type response.
	 */
	function gutenberg_add_post_type_rendering_mode() {
		$controller = new Gutenberg_REST_Post_Types_Controller_6_8();
		$controller->register_routes();
	}
}
add_action( 'rest_api_init', 'gutenberg_add_post_type_rendering_mode' );

/**
 * Overrides the default 'WP_REST_Terms_Controller' class for all taxonomies upon registration.
 *
 * @return array The updated taxonomy registration arguments.
 */
function gutenberg_override_terms_controller_6_8( $args, $taxonomy ) {
	if ( empty( $args['show_in_rest'] ) ) {
		return $args;
	}

	if ( isset( $args['rest_controller_class'] ) && 'WP_REST_Terms_Controller' !== $args['rest_controller_class'] ) {
		return $args;
	}

	$args['rest_controller_class'] = Gutenberg_REST_Terms_Controller_6_8::class;
	return $args;
}
add_filter( 'register_taxonomy_args', 'gutenberg_override_terms_controller_6_8', 10, 2 );
