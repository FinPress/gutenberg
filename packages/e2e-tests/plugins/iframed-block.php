<?php
/**
 * Plugin Name: Gutenberg Test Iframed Block
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-iframed-block
 */

add_action(
	'setup_theme',
	static function () {
		add_theme_support( 'block-templates' );
	}
);

add_action(
	'init',
	static function () {
		fp_register_script(
			'iframed-block-jquery-test',
			plugin_dir_url( __FILE__ ) . 'iframed-block/jquery.test.js',
			array( 'jquery' ),
			filemtime( plugin_dir_path( __FILE__ ) . 'iframed-block/jquery.test.js' )
		);
		fp_register_script(
			'iframed-block-editor',
			plugin_dir_url( __FILE__ ) . 'iframed-block/editor.js',
			array(
				'fp-blocks',
				'fp-block-editor',
				'fp-element',
				'fp-compose',
				'iframed-block-jquery-test',
			),
			filemtime( plugin_dir_path( __FILE__ ) . 'iframed-block/editor.js' )
		);
		fp_register_script(
			'iframed-block-script',
			plugin_dir_url( __FILE__ ) . 'iframed-block/script.js',
			array( 'iframed-block-jquery-test' ),
			filemtime( plugin_dir_path( __FILE__ ) . 'iframed-block/script.js' )
		);
		register_block_type_from_metadata( __DIR__ . '/iframed-block' );
	}
);
