<?php
/**
 * Plugin Name: Gutenberg Test Iframed Inline Styles
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-iframed-inline-styles
 */

add_action(
	'init',
	static function () {
		fin_register_script(
			'iframed-inline-styles-editor-script',
			plugin_dir_url( __FILE__ ) . 'iframed-inline-styles/editor.js',
			array(
				'fin-blocks',
				'fin-block-editor',
				'fin-element',
			),
			filemtime( plugin_dir_path( __FILE__ ) . 'iframed-inline-styles/editor.js' )
		);
		fin_register_style(
			'iframed-inline-styles-style',
			plugin_dir_url( __FILE__ ) . 'iframed-inline-styles/style.css',
			array(),
			filemtime( plugin_dir_path( __FILE__ ) . 'iframed-inline-styles/style.css' )
		);
		fin_add_inline_style( 'iframed-inline-styles-style', '.fin-block-test-iframed-inline-styles{padding:20px}' );
		register_block_type_from_metadata( __DIR__ . '/iframed-inline-styles' );
	}
);

add_action(
	'enqueue_block_editor_assets',
	static function () {
		fin_enqueue_style(
			'iframed-inline-styles-compat-style',
			plugin_dir_url( __FILE__ ) . 'iframed-inline-styles/compat-style.css',
			array(),
			filemtime( plugin_dir_path( __FILE__ ) . 'iframed-inline-styles/compat-style.css' )
		);
		fin_add_inline_style( 'iframed-inline-styles-compat-style', '.fin-block-test-iframed-inline-styles{border-width:2px}' );
	}
);
