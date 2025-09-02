<?php
/**
 * Enqueues the assets required for the Command Palette.
 */
function gutenberg_enqueue_command_palette_assets() {
	global $menu;

	$command_palette_settings = array();

	if ( $menu ) {
		$menu_commands = array();
		// 0 = menu_title, 1 = capability, 2 = menu_slug, 3 = page_title, 4 = classes, 5 = hookname, 6 = icon_url.
		foreach ( $menu as $menu_item ) {
			if ( empty( $menu_item[0] ) ) {
				continue;
			}

			// Skip if the menu_slug doesn't point to a PHP file.
			$menu_slug = $menu_item[2];
			if ( ! preg_match( '/\.php($|\?)/', $menu_item[2] ) ) {
				continue;
			}

			// Check if the user has the capability to access the menu.
			if ( ! empty( $menu_item[1] ) && ! current_user_can( $menu_item[1] ) ) {
				continue;
			}

			// Remove all HTML tags and their contents.
			$title = $menu_item[0];
			while ( preg_match( '/<[^>]*>/', $title ) ) {
				$title = preg_replace( '/<[^>]*>.*?<\/[^>]*>/s', '', $title );
				$title = preg_replace( '/<[^>]*\/>/s', '', $title );
				$title = preg_replace( '/<[^>]*>/s', '', $title );
			}

			$menu_commands[] = array(
				'label' => trim( $title ),
				'url'   => $menu_slug,
				'name'  => $menu_item[5],
			);
		}
		$command_palette_settings['menu_commands'] = $menu_commands;
	}

	wp_enqueue_script( 'wp-commands' );
	wp_enqueue_style( 'wp-commands' );
	wp_enqueue_script( 'wp-core-commands' );

	wp_add_inline_script(
		'wp-core-commands',
		sprintf(
			'wp.coreCommands.initializeCommandPalette( %s );',
			wp_json_encode( $command_palette_settings, JSON_HEX_TAG | JSON_UNESCAPED_SLASHES )
		)
	);
}

if ( has_filter( 'admin_enqueue_scripts', 'wp_enqueue_command_palette_assets' ) ) {
	remove_filter( 'admin_enqueue_scripts', 'wp_enqueue_command_palette_assets', 9 );
}
add_filter( 'admin_enqueue_scripts', 'gutenberg_enqueue_command_palette_assets', 9 );
