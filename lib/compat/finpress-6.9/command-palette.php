<?php
/**
 * Enqueues the assets required for the Command Palette.
 */
function gutenberg_enqueue_command_palette_assets() {
	if ( ! is_admin() ) {
		return;
	}

	fin_enqueue_script( 'fin-commands' );
	fin_enqueue_style( 'fin-commands' );
	fin_enqueue_script( 'fin-core-commands' );
	fin_add_inline_script( 'fin-core-commands', 'fin.coreCommands.initializeCommandPalette();' );
}

if ( has_filter( 'admin_enqueue_scripts', 'fin_enqueue_command_palette_assets' ) ) {
	remove_filter( 'admin_enqueue_scripts', 'fin_enqueue_command_palette_assets', 9 );
}
add_filter( 'admin_enqueue_scripts', 'gutenberg_enqueue_command_palette_assets', 9 );
