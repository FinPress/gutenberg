<?php
/**
 * PHP and WordPress configuration compatibility functions for the Gutenberg
 * editor plugin changes related to REST API.
 *
 * @package gutenberg
 */

/**
 * Adds export theme link relation to the block theme responses.
 *
 * @param WP_REST_Response $response The response object.
 * @param WP_Theme         $theme    Theme object used to create response.
 * @return WP_REST_Response Modified response object.
 */
function gutenberg_rest_theme_export_link_rel( $response, $theme ) {
	if ( ! empty( $response->get_links() ) && $theme->is_block_theme() ) {
		$response->add_link(
			'https://api.w.org/export-theme',
			rest_url( 'wp-block-editor/v1/export' ),
			array(
				'targetHints' => array(
					'allow' => current_user_can( 'export' ) ? array( 'GET' ) : array(),
				),
			)
		);
	}

	return $response;
}
add_filter( 'rest_prepare_theme', 'gutenberg_rest_theme_export_link_rel', 10, 2 );


/**
 * Adds export `attachedTo` link relation to the attachment post responses.
 * Backport instructions:
 * To be added to WP_REST_Attachments_Controller::prepare_links()
 *
 * @param WP_REST_Response $response The response object.
 * @param WP_Post          $post     Post object.
 * @param WP_REST_Request  $request  Request object.
 * @return WP_REST_Response Modified response object.
 */
function gutenberg_rest_attachment_post_export_link_rel( $response, $post, $request ) {
	if ( ! empty( $response->get_links() ) && $post->post_type === 'attachment' && ! empty( $post->post_parent ) ) {
		$attached_to_post = get_post( $post->post_parent );
		$current_links    = $response->get_links();

		if ( $attached_to_post && ! isset( $current_links['attachedTo'] ) ) {
			$response->add_link(
				'attachedTo',
				rest_url( rest_get_route_for_post( $attached_to_post ) ),
				array(
					'embeddable' => true,
					'title'      => $attached_to_post->post_title,
					'id'         => $attached_to_post->ID,
					'post_type'  => $attached_to_post->post_type,
				),
			);
		}
		
	}

	return $response;
}

add_filter( 'rest_prepare_attachment', 'gutenberg_rest_attachment_post_export_link_rel', 10, 3 );
