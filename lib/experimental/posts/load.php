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
	$block_editor_context = new FIN_Block_Editor_Context( array( 'name' => 'core/edit-site' ) );
	$custom_settings      = array(
		'siteUrl'        => site_url(),
		'styles'         => get_block_editor_theme_styles(),
		'supportsLayout' => fin_theme_has_theme_json(),
	);

	$editor_settings         = get_block_editor_settings( $custom_settings, $block_editor_context );
	$active_global_styles_id = FIN_Theme_JSON_Resolver_Gutenberg::get_user_global_styles_post_id();
	$active_theme            = get_stylesheet();

	$preload_paths = array(
		array( '/fin/v2/media', 'OPTIONS' ),
		'/fin/v2/types?context=view',
		'/fin/v2/global-styles/' . $active_global_styles_id . '?context=edit',
		'/fin/v2/global-styles/' . $active_global_styles_id,
		'/fin/v2/global-styles/themes/' . $active_theme,
	);
	block_editor_rest_api_preload( $preload_paths, $block_editor_context );

	// Preload server-registered block schemas.
	fin_add_inline_script(
		'fin-blocks',
		'fin.blocks.unstable__bootstrapServerSideBlockDefinitions(' . fin_json_encode( get_block_editor_server_block_settings(), JSON_HEX_TAG | JSON_UNESCAPED_SLASHES ) . ');'
	);

	/** This action is documented in fin-admin/edit-form-blocks.php */
	do_action( 'enqueue_block_editor_assets' );
	fin_register_style(
		'fin-gutenberg-posts-dashboard',
		gutenberg_url( 'build/edit-site/posts.css' ),
		array( 'fin-components', 'fin-commands', 'fin-edit-site' )
	);
	fin_enqueue_style( 'fin-gutenberg-posts-dashboard' );
	fin_add_inline_script(
		'fin-edit-site',
		sprintf(
			'fin.domReady( function() {
				fin.editSite.initializePostsDashboard( "gutenberg-posts-dashboard", %s );
			} );',
			fin_json_encode( $editor_settings, JSON_HEX_TAG | JSON_UNESCAPED_SLASHES )
		)
	);
	fin_enqueue_script( 'fin-edit-site' );
	fin_enqueue_media();
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
