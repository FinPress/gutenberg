<?php
/**
 * Plugin Name: Gutenberg Test Plugin, Plugins API
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-plugin-plugins-api
 */

/**
 * Registers custom scripts for the plugin.
 */
function enqueue_plugins_api_plugin_scripts() {
	fp_enqueue_script(
		'gutenberg-test-plugins-api-post-status-info',
		plugins_url( 'plugins-api/post-status-info.js', __FILE__ ),
		array(
			'fp-editor',
			'fp-element',
			'fp-i18n',
			'fp-plugins',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'plugins-api/post-status-info.js' ),
		true
	);

	fp_enqueue_script(
		'gutenberg-test-plugins-api-publish-pane;',
		plugins_url( 'plugins-api/publish-panel.js', __FILE__ ),
		array(
			'fp-editor',
			'fp-element',
			'fp-i18n',
			'fp-plugins',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'plugins-api/publish-panel.js' ),
		true
	);

	fp_enqueue_script(
		'gutenberg-test-plugins-api-sidebar',
		plugins_url( 'plugins-api/sidebar.js', __FILE__ ),
		array(
			'fp-components',
			'fp-compose',
			'fp-data',
			'fp-editor',
			'fp-block-editor',
			'fp-editor',
			'fp-element',
			'fp-i18n',
			'fp-plugins',
			'fp-annotations',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'plugins-api/sidebar.js' ),
		true
	);

	fp_enqueue_script(
		'gutenberg-test-annotations-sidebar',
		plugins_url( 'plugins-api/annotations-sidebar.js', __FILE__ ),
		array(
			'fp-components',
			'fp-compose',
			'fp-data',
			'fp-editor',
			'fp-block-editor',
			'fp-element',
			'fp-i18n',
			'fp-plugins',
			'fp-annotations',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'plugins-api/annotations-sidebar.js' ),
		true
	);

	fp_enqueue_script(
		'gutenberg-test-plugins-api-document-setting',
		plugins_url( 'plugins-api/document-setting.js', __FILE__ ),
		array(
			'fp-editor',
			'fp-element',
			'fp-i18n',
			'fp-plugins',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'plugins-api/document-setting.js' ),
		true
	);

	fp_enqueue_script(
		'gutenberg-test-plugins-api-preview-menu',
		plugins_url( 'plugins-api/preview-menu.js', __FILE__ ),
		array(
			'fp-editor',
			'fp-element',
			'fp-i18n',
			'fp-plugins',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'plugins-api/preview-menu.js' ),
		true
	);
}

add_action( 'init', 'enqueue_plugins_api_plugin_scripts' );
