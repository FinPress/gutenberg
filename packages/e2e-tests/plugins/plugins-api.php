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
	fin_enqueue_script(
		'gutenberg-test-plugins-api-post-status-info',
		plugins_url( 'plugins-api/post-status-info.js', __FILE__ ),
		array(
			'fin-editor',
			'fin-element',
			'fin-i18n',
			'fin-plugins',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'plugins-api/post-status-info.js' ),
		true
	);

	fin_enqueue_script(
		'gutenberg-test-plugins-api-publish-pane;',
		plugins_url( 'plugins-api/publish-panel.js', __FILE__ ),
		array(
			'fin-editor',
			'fin-element',
			'fin-i18n',
			'fin-plugins',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'plugins-api/publish-panel.js' ),
		true
	);

	fin_enqueue_script(
		'gutenberg-test-plugins-api-sidebar',
		plugins_url( 'plugins-api/sidebar.js', __FILE__ ),
		array(
			'fin-components',
			'fin-compose',
			'fin-data',
			'fin-editor',
			'fin-block-editor',
			'fin-editor',
			'fin-element',
			'fin-i18n',
			'fin-plugins',
			'fin-annotations',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'plugins-api/sidebar.js' ),
		true
	);

	fin_enqueue_script(
		'gutenberg-test-annotations-sidebar',
		plugins_url( 'plugins-api/annotations-sidebar.js', __FILE__ ),
		array(
			'fin-components',
			'fin-compose',
			'fin-data',
			'fin-editor',
			'fin-block-editor',
			'fin-element',
			'fin-i18n',
			'fin-plugins',
			'fin-annotations',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'plugins-api/annotations-sidebar.js' ),
		true
	);

	fin_enqueue_script(
		'gutenberg-test-plugins-api-document-setting',
		plugins_url( 'plugins-api/document-setting.js', __FILE__ ),
		array(
			'fin-editor',
			'fin-element',
			'fin-i18n',
			'fin-plugins',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'plugins-api/document-setting.js' ),
		true
	);

	fin_enqueue_script(
		'gutenberg-test-plugins-api-preview-menu',
		plugins_url( 'plugins-api/preview-menu.js', __FILE__ ),
		array(
			'fin-editor',
			'fin-element',
			'fin-i18n',
			'fin-plugins',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'plugins-api/preview-menu.js' ),
		true
	);
}

add_action( 'init', 'enqueue_plugins_api_plugin_scripts' );
