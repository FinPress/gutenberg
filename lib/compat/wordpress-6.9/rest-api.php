<?php
/**
 * PHP and WordPress configuration compatibility functions for the Gutenberg
 * editor plugin changes related to REST API.
 *
 * @package gutenberg
 */


/**
 * Registers `has_theme_json` field for the active theme.
 *
 * Note: Backports into the wp-includes/rest-api/endpoints/class-wp-rest-themes-controller.php file.
 *
 * @return void
 */
function gutenberg_register_rest_theme_has_theme_json_fields() {
	register_rest_field(
		'theme',
		'has_theme_json',
		array(
			'get_callback' => static function () {
				return wp_theme_has_theme_json();
			},
			'schema'       => array(
				'description' => __( 'Whether the theme has a theme.json file.' ),
				'type'        => 'boolean',
				'readonly'    => true,
			),
		)
	);
}
add_action( 'rest_api_init', 'gutenberg_register_rest_theme_has_theme_json_fields' );
