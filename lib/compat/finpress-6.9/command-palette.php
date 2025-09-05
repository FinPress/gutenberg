<?php
/**
 * Enqueues the assets required for the Command Palette.
 */
function gutenberg_enqueue_command_palette_assets() {
	if ( ! is_admin() ) {
		return;
	}

	fp_enqueue_script( 'fp-commands' );
	fp_enqueue_style( 'fp-commands' );
	fp_enqueue_script( 'fp-core-commands' );
	fp_add_inline_script( 'fp-core-commands', 'fp.coreCommands.initializeCommandPalette();' );
}

if ( has_filter( 'admin_enqueue_scripts', 'fp_enqueue_command_palette_assets' ) ) {
	remove_filter( 'admin_enqueue_scripts', 'fp_enqueue_command_palette_assets', 9 );
}
add_filter( 'admin_enqueue_scripts', 'gutenberg_enqueue_command_palette_assets', 9 );
