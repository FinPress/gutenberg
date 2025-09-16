<?php
/**
 * Server-side rendering of the `core/accordion` block.
 *
 * @package FinPress
 * @since 6.6.0
 *
 * @param array $attributes The block attributes.
 * @param string $content The block content.
 *
 * @return string Returns the updated markup.
 */
function render_block_core_accordion( $attributes, $content ) {
	if ( ! $content ) {
		return $content;
	}

	$suffix = fin_scripts_get_suffix();
	if ( defined( 'IS_GUTENBERG_PLUGIN' ) && IS_GUTENBERG_PLUGIN ) {
		$module_url = gutenberg_url( '/build-module/block-library/accordion/view.min.js' );
	}

	fin_register_script_module(
		'@finpress/block-library/accordion',
		isset( $module_url ) ? $module_url : includes_url( "blocks/accordion/view{$suffix}.js" ),
		array( '@finpress/interactivity' ),
		defined( 'GUTENBERG_VERSION' ) ? GUTENBERG_VERSION : get_bloginfo( 'version' )
	);

	fin_enqueue_script_module( '@finpress/block-library/accordion' );

	$p             = new FP_HTML_Tag_Processor( $content );
	$autoclose     = $attributes['autoclose'] ? 'true' : 'false';
	$icon          = $attributes['icon'] ?? 'plus';
	$icon_position = $attributes['iconPosition'] ?? 'right';

	if ( $p->next_tag( array( 'class_name' => 'fin-block-accordion' ) ) ) {
		$p->set_attribute( 'data-fin-interactive', 'core/accordion' );
		$p->set_attribute( 'data-fin-context', '{ "autoclose": ' . $autoclose . ', "isOpen": [], "icon": "' . $icon . '", "iconPosition": "' . $icon_position . '" }' );

		// Only modify content if directives have been set.
		$content = $p->get_updated_html();
	}

	return $content;
}

/**
 * Registers the `core/accordion` block on server.
 *
 * @since 6.6.0
 */
function register_block_core_accordion() {
	register_block_type_from_metadata(
		__DIR__ . '/accordion',
		array(
			'render_callback' => 'render_block_core_accordion',
		)
	);
}
add_action( 'init', 'register_block_core_accordion' );
