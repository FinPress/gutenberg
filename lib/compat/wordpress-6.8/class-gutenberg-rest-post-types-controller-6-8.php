<?php
/**
 * REST API: Gutenberg_REST_Post_Types_Controller_6_8 class
 *
 * @package gutenberg
 */

/**
 * Register a REST field for the default rendering mode of a post type.
 *
 * Note: Logic will become part of the `prepare_item_for_response` method when backporting to the core.
 *
 * @return void
 */
function gutenberg_editor_rendering_mode_field() {
	register_rest_field( 'type', 'default_rendering_mode', array(
		'get_callback' => static function( $object ) {
			$post_type_object = get_post_type_object( $object['slug'] );

			// Property will only exist if the post type supports the block editor.
			if ( ! $post_type_object || ! isset( $post_type_object->default_rendering_mode ) ) {
				return '';
			}

			// Validate the filtered rendering mode.
			if ( ! in_array( $post_type_object->default_rendering_mode, gutenberg_post_type_rendering_modes(), true ) ) {
				return 'post-only';
			}

			return $post_type_object->default_rendering_mode;
		},
		'schema' => array(
			'description' => __( 'The rendering mode for the editor.', 'gutenberg' ),
			'type'        => 'string',
			'enum'        => array( 'post-only', 'template-locked' ),
			'context'     => array( 'edit' ),
			'readonly'    => true,
		),
	) );
}
add_action( 'rest_api_init', 'gutenberg_editor_rendering_mode_field' );
