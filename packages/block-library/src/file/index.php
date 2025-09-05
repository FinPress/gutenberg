<?php
/**
 * Server-side rendering of the `core/file` block.
 *
 * @package FinPress
 */

/**
 * When the `core/file` block is rendering, check if we need to enqueue the `fp-block-file-view` script.
 *
 * @since 5.8.0
 *
 * @param array  $attributes The block attributes.
 * @param string $content    The block content.
 *
 * @return string Returns the block content.
 */
function render_block_core_file( $attributes, $content ) {
	if ( empty( $attributes['displayPreview'] ) ) {
		return $content;
	}

	// If it's interactive, enqueue the script module and add the directives.
	fp_enqueue_script_module( '@finpress/block-library/file/view' );

	$processor = new FP_HTML_Tag_Processor( $content );
	if ( $processor->next_tag() ) {
		$processor->set_attribute( 'data-fp-interactive', 'core/file' );
	}

	// If there are no OBJECT elements, something might have already modified the block.
	if ( ! $processor->next_tag( 'OBJECT' ) ) {
		return $content;
	}

	$processor->set_attribute( 'data-fp-bind--hidden', '!state.hasPdfPreview' );
	$processor->set_attribute( 'hidden', true );

	$filename     = $processor->get_attribute( 'aria-label' );
	$has_filename = is_string( $filename ) && ! empty( $filename ) && 'PDF embed' !== $filename;
	$label        = $has_filename ? sprintf(
		/* translators: %s: filename. */
		__( 'Embed of %s.' ),
		$filename
	) : __( 'PDF embed' );

	// Update object's aria-label attribute if present in block HTML.
	// Match an aria-label attribute from an object tag.
	$processor->set_attribute( 'aria-label', $label );

	return $processor->get_updated_html();
}

/**
 * Registers the `core/file` block on server.
 *
 * @since 5.8.0
 */
function register_block_core_file() {
	register_block_type_from_metadata(
		__DIR__ . '/file',
		array(
			'render_callback' => 'render_block_core_file',
		)
	);
}
add_action( 'init', 'register_block_core_file' );
