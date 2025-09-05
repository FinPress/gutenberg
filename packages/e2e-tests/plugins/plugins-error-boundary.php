<?php
/**
 * Plugin Name: Gutenberg Test Plugin, Plugins Error Boundary
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-plugin-plugins-error-boundary
 */

/**
 * Registers custom scripts for the plugin error boundary.
 */
function enqueue_plugins_error_boundary_plugin_scripts() {
	fp_enqueue_script(
		'gutenberg-test-plugin-plugins-error-boundary',
		plugins_url( 'plugins-api/error-boundary.js', __FILE__ ),
		array(
			'fp-edit-post',
			'fp-element',
			'fp-i18n',
			'fp-plugins',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'plugins-api/error-boundary.js' ),
		true
	);
}
add_action( 'init', 'enqueue_plugins_error_boundary_plugin_scripts' );
