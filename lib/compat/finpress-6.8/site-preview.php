<?php
if ( ! function_exists( 'fp_initialize_site_preview_hooks' ) ) {
	/**
	 * Initialize site preview.
	 *
	 * This function sets IFRAME_REQUEST to true if the site preview parameter is set.
	 */
	function fp_initialize_site_preview_hooks() {
		if (
			! defined( 'IFRAME_REQUEST' ) &&
			isset( $_GET['fp_site_preview'] ) &&
			1 === (int) $_GET['fp_site_preview'] &&
			current_user_can( 'edit_theme_options' )
		) {
			define( 'IFRAME_REQUEST', true );
		}
	}
}
add_action( 'init', 'fp_initialize_site_preview_hooks', 1 );
