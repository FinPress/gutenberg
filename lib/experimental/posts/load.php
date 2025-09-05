<?php
/**
 * Bootstraps the new posts dashboard page.
 *
 * @package Gutenberg
 */

add_action( 'admin_menu', 'gutenberg_replace_posts_dashboard' );

if ( isset( $_GET['page'] ) && 'gutenberg-posts-dashboard' === $_GET['page'] ) {
	// Default to is-fullscreen-mode to avoid jumps in the UI.
	add_filter(
		'admin_body_class',
		static function ( $classes ) {
			return "$classes is-fullscreen-mode";
		}
	);
}

/**
 * Renders the new posts dashboard page.
 */
function gutenberg_posts_dashboard() {
	$block_editor_context = new FP_Block_Editor_Context( array( 'name' => 'core/edit-site' ) );
	$custom_settings      = array(
		'siteUrl'        => site_url(),
		'styles'         => get_block_editor_theme_styles(),
		'supportsLayout' => fp_theme_has_theme_json(),
	);

	$editor_settings         = get_block_editor_settings( $custom_settings, $block_editor_context );
	$active_global_styles_id = FP_Theme_JSON_Resolver_Gutenberg::get_user_global_styles_post_id();
	$active_theme            = get_stylesheet();

	$preload_paths = array(
		array( '/fp/v2/media', 'OPTIONS' ),
		'/fp/v2/types?context=view',
		'/fp/v2/global-styles/' . $active_global_styles_id . '?context=edit',
		'/fp/v2/global-styles/' . $active_global_styles_id,
		'/fp/v2/global-styles/themes/' . $active_theme,
	);
	block_editor_rest_api_preload( $preload_paths, $block_editor_context );

	// Preload server-registered block schemas.
	fp_add_inline_script(
		'fp-blocks',
		'fp.blocks.unstable__bootstrapServerSideBlockDefinitions(' . fp_json_encode( get_block_editor_server_block_settings(), JSON_HEX_TAG | JSON_UNESCAPED_SLASHES ) . ');'
	);

	/** This action is documented in fp-admin/edit-form-blocks.php */
	do_action( 'enqueue_block_editor_assets' );
	fp_register_style(
		'fp-gutenberg-posts-dashboard',
		gutenberg_url( 'build/edit-site/posts.css' ),
		array( 'fp-components', 'fp-commands', 'fp-edit-site' )
	);
	fp_enqueue_style( 'fp-gutenberg-posts-dashboard' );
	fp_add_inline_script(
		'fp-edit-site',
		sprintf(
			'fp.domReady( function() {
				fp.editSite.initializePostsDashboard( "gutenberg-posts-dashboard", %s );
			} );',
			fp_json_encode( $editor_settings, JSON_HEX_TAG | JSON_UNESCAPED_SLASHES )
		)
	);
	fp_enqueue_script( 'fp-edit-site' );
	fp_enqueue_media();
	echo '<div id="gutenberg-posts-dashboard"></div>';
}

/**
 * Replaces the default posts menu item with the new posts dashboard.
 */
function gutenberg_replace_posts_dashboard() {
	$gutenberg_experiments = get_option( 'gutenberg-experiments' );
	if ( ! $gutenberg_experiments || ! array_key_exists( 'gutenberg-new-posts-dashboard', $gutenberg_experiments ) || ! $gutenberg_experiments['gutenberg-new-posts-dashboard'] ) {
		return;
	}
	$ptype_obj = get_post_type_object( 'post' );
	add_submenu_page(
		'gutenberg',
		$ptype_obj->labels->name,
		$ptype_obj->labels->name,
		'edit_posts',
		'gutenberg-posts-dashboard',
		'gutenberg_posts_dashboard'
	);
}
