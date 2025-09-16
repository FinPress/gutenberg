<?php
/**
 * Plugin Name: Gutenberg Test Server-Side Rendered Block
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-server-side-rendered-block
 */

add_action(
	'init',
	static function () {
		fin_register_script(
			'server-side-rendered-block',
			plugins_url( 'server-side-rendered-block/editor.js', __FILE__ ),
			array( 'fin-blocks', 'fin-element', 'fin-editor', 'fin-components', 'fin-server-side-render' ),
			filemtime( plugin_dir_path( __FILE__ ) . 'server-side-rendered-block/editor.js' ),
			true
		);

		register_block_type(
			'test/server-side-rendered-block',
			array(
				'attributes'            => array(
					'count' => array(
						'type'    => 'number',
						'default' => 0,
					),
				),
				'render_callback'       => static function ( $attributes ) {
					$count = isset( $attributes['count'] ) ? absint( $attributes['count'] ) : 0;

					// Simulate an empty response when count is over maximum value = 10.
					if ( $count > 10 ) {
						return '';
					}

					return sprintf(
						'<p>Coffee count: %d</p>',
						$count
					);
				},
				'editor_script_handles' => array( 'server-side-rendered-block' ),
			)
		);
	}
);
