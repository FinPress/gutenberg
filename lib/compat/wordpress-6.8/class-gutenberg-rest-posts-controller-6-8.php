<?php
/**
 * REST API: Gutenberg_REST_Posts_Controller_6_8 class
 *
 * @package gutenberg
 */

/**
 * Gutenberg_REST_Posts_Controller_6_8 class
 *
 * Adds a /counts route to return total posts count.
 */
class Gutenberg_REST_Posts_Controller_6_8 extends Gutenberg_REST_Posts_Controller_6_7 {
	/**
	 * Registers the routes for attachments.
	 *
	 * @see register_rest_route()
	 */
	public function register_routes() {
		parent::register_routes();

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/count',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_count' ),
					'permission_callback' => array( $this, 'get_count_permissions_check' ),
				),
				'schema' => array( $this, 'get_count_schema' ),
			)
		);
	}

	/**
	 * Retrieves post counts for the post type.
	 *
	 * @since 6.8.0
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_count() {
		$counts = wp_count_posts( $this->post_type );
		$data   = array();

		if ( ! empty( $counts ) ) {
			/*
			 * The fields comprise all non-internal post statuses,
			 * including any custom statuses that may be registered.
			 * 'trash' is an exception, so if it exists, it is added separately.
			 */
			$post_stati = get_post_stati( array( 'internal' => false ) );

			if ( get_post_status_object( 'trash' ) ) {
				$post_stati[] = 'trash';
			}
			// Include all public statuses in the response if there is a count.
			foreach ( $post_stati as $status ) {
				if ( isset( $counts->$status ) ) {
					$data[ $status ] = (int) $counts->$status;
				}
			}
		}
		return rest_ensure_response( $data );
	}

	/**
	 * Checks if a given request has access to read post counts.
	 *
	 * @since 6.8.0
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_count_permissions_check() {
		$post_type = get_post_type_object( $this->post_type );

		if ( ! current_user_can( $post_type->cap->read ) ) {
			return new WP_Error(
				'rest_cannot_read',
				__( 'Sorry, you are not allowed to read post counts for this post type.' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		return true;
	}

	/**
	 * Retrieves the post counts schema, conforming to JSON Schema.
	 *
	 * @since 6.8.0
	 *
	 * @return array Item schema data.
	 */
	public function get_count_schema() {
		return array(
			'$schema'              => 'http://json-schema.org/draft-04/schema#',
			'title'                => 'post-counts',
			'type'                 => 'object',
			/*
			 * Use a pattern matcher for post status keys.
			 * This allows for custom post statuses to be included,
			 * which can be registered after the schema is generated.
			 */
			'patternProperties'    => array(
				'^\w+$' => array(
					'description' => __( 'The number of posts for a given status.' ),
					'type'        => 'integer',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
			),
			'additionalProperties' => false,
		);
	}

	/**
	 * Add Block Editor default rendering mode setting to the response.
	 *
	 * @param  WP_Post_Type    $item    Post type object.
	 * @param  WP_REST_Request $request Request object.
	 * @return WP_REST_Response Response object.
	 */
	public function prepare_item_for_response( $item, $request ) {
		$response = parent::prepare_item_for_response( $item, $request );
		$context  = ! empty( $request['context'] ) ? $request['context'] : 'view';

		// Property will only exist if the post type supports the block editor.
		if ( 'edit' === $context && property_exists( $item, 'default_rendering_mode' ) ) {
			/**
			 * Filters the block editor rendering mode for a post type.
			 *
			 * @since 6.8.0
			 * @param string       $default_rendering_mode Default rendering mode for the post type.
			 * @param WP_Post_Type $post_type              Post type name.
			 * @return string Default rendering mode for the post type.
			 */
			$rendering_mode = apply_filters( 'post_type_default_rendering_mode', $item->default_rendering_mode, $item );

			/**
			 * Filters the block editor rendering mode for a specific post type.
			 * Applied after the generic `post_type_default_rendering_mode` filter.
			 *
			 * The dynamic portion of the hook name, `$item->name`, refers to the post type slug.
			 *
			 * @since 6.8.0
			 * @param string       $default_rendering_mode Default rendering mode for the post type.
			 * @param WP_Post_Type $post_type              Post type object.
			 * @return string Default rendering mode for the post type.
			 */
			$rendering_mode = apply_filters( "post_type_{$item->name}_default_rendering_mode", $rendering_mode, $item );

			// Validate the filtered rendering mode.
			if ( ! in_array( $rendering_mode, gutenberg_post_type_rendering_modes(), true ) ) {
				$rendering_mode = 'post-only';
			}

			$response->data['default_rendering_mode'] = $rendering_mode;
		}

		return rest_ensure_response( $response );
	}
}
