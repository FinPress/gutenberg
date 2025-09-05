<?php
/**
 * Plugin Name: Lightbox Allow Editing False Enabled False
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-lightbox-allow-editing-false-enabled-false
 */

function filter_theme_json_theme( $theme_json ) {
	$new_data = array(
		'version'  => 2,
		'settings' => array(
			'blocks' => array(
				'core/image' => array(
					'lightbox' => array(
						'allowEditing' => false,
						'enabled'      => false,
					),
				),
			),
		),
	);
	return $theme_json->update_with( $new_data );
}
add_filter( 'fp_theme_json_data_theme', 'filter_theme_json_theme' );
