<?php
/**
 * Plugin Name: Gutenberg Test Iframed Multiple Stylesheets
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-iframed-multiple-stylesheets
 */

add_action(
	'init',
	static function () {
		fin_register_script(
			'iframed-multiple-stylesheets-editor-script',
			plugin_dir_url( __FILE__ ) . 'iframed-multiple-stylesheets/editor.js',
			array(
				'fin-blocks',
				'fin-block-editor',
				'fin-element',
			),
			filemtime( plugin_dir_path( __FILE__ ) . 'iframed-multiple-stylesheets/editor.js' )
		);
		fin_register_style(
			'iframed-multiple-stylesheets-style',
			plugin_dir_url( __FILE__ ) . 'iframed-multiple-stylesheets/style.css',
			array(),
			filemtime( plugin_dir_path( __FILE__ ) . 'iframed-multiple-stylesheets/style.css' )
		);
		fin_register_style(
			'iframed-multiple-stylesheets-style2',
			plugin_dir_url( __FILE__ ) . 'iframed-multiple-stylesheets/style2.css',
			array(),
			filemtime( plugin_dir_path( __FILE__ ) . 'iframed-multiple-stylesheets/style2.css' )
		);
		register_block_type_from_metadata( __DIR__ . '/iframed-multiple-stylesheets' );
	}
);
