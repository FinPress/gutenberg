<?php
/**
 * REST API: Gutenberg_REST_Posts_Controller_6_6 class
 *
 * @package    gutenberg
 */

/**
 * Gutenberg_REST_Posts_Controller_6_6 class
 *
 * `wp_navigation` currently only allow access to administrators with the
 * `edit_theme_options` capability. In order to allow other roles to also view the templates,
 * we need to override the permissions check for the REST API endpoints.
 */
class Gutenberg_REST_Posts_Controller_6_6 extends WP_REST_Posts_Controller {

	/**
	 * Checks if a given request has access to read posts of type:
	 *  - `wp_navigation`
	 *
	 * @since 6.8
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		if ( 'wp_navigation' !== $this->post_type ) {
			return parent::get_items_permissions_check( $request );
		}

		if ( current_user_can( 'edit_posts' ) ) {
			return true;
		}

		foreach ( get_post_types( array( 'show_in_rest' => true ), 'objects' ) as $post_type ) {
			if ( current_user_can( $post_type->cap->edit_posts ) ) {
				return true;
			}
		}

		return parent::get_items_permissions_check( $request );
	}

	/**
	 * Checks if a given request has access to read posts of type:
	 *  - `wp_navigation`
	 *
	 * @since 6.8
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		if ( 'wp_navigation' !== $this->post_type ) {
			return parent::get_item_permissions_check( $request );
		}
		
		if ( current_user_can( 'edit_posts' ) ) {
			return true;
		}
		foreach ( get_post_types( array( 'show_in_rest' => true ), 'objects' ) as $post_type ) {
			if ( current_user_can( $post_type->cap->edit_posts ) ) {
				return true;
			}
		}

		return parent::get_item_permissions_check( $request );
	}
}
