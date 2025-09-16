<?php
/**
 * Plugin Name: Gutenberg Test Iframed Masonry Block
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-iframed-masonry-block
 */

add_action(
	'init',
	static function () {
		fin_register_script(
			'iframed-masonry-block-editor',
			plugin_dir_url( __FILE__ ) . 'iframed-masonry-block/editor.js',
			array(
				'fin-blocks',
				'fin-block-editor',
				'fin-element',
				'fin-compose',
				'masonry',
			),
			filemtime( plugin_dir_path( __FILE__ ) . 'iframed-masonry-block/editor.js' )
		);
		fin_register_script(
			'iframed-masonry-block-script',
			plugin_dir_url( __FILE__ ) . 'iframed-masonry-block/script.js',
			array( 'masonry' ),
			filemtime( plugin_dir_path( __FILE__ ) . 'iframed-masonry-block/script.js' )
		);
		register_block_type_from_metadata( __DIR__ . '/iframed-masonry-block' );
	}
);
