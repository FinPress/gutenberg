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
 * Adds edit link relation to the attachment responses.
 *
 * @param WP_REST_Response $response   The response object.
 * @param WP_Post          $attachment Attachment object used to create response.
 * @return WP_REST_Response Modified   response object.
 */
function gutenberg_rest_attachment_edit_link_rel( $response, $attachment ) {
	if ( $attachment->post_type === 'attachment' ) {
		$links = $response->get_links();
		$edit_link_rel = 'https://api.w.org/duplicate-modified';
		
		// Only add the link if it doesn't already exist
		if ( empty( $links[ $edit_link_rel ] ) ) {
			$response->add_link(
				$edit_link_rel,
				rest_url( 'wp/v2/media/' . $attachment->ID . '/edit' ),
			);
		}
	}

	return $response;
}
add_filter( 'rest_prepare_attachment', 'gutenberg_rest_attachment_edit_link_rel', 10, 2 );
