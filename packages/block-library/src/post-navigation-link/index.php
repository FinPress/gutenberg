<?php
/**
 * Server-side rendering of the `core/post-navigation-link` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/post-navigation-link` block on the server.
 *
 * @since 5.9.0
 *
 * @param array  $attributes Block attributes.
 * @param string $content    Block default content.
 *
 * @return string Returns the next or previous post link that is adjacent to the current post.
 */
function render_block_core_post_navigation_link( $attributes, $content ) {
	if ( ! is_singular() ) {
		return '';
	}

	// Get the navigation type to show the proper link. 
	$navigation_type = isset( $attributes['type'] ) && 'previous' === $attributes['type'] ? 'previous' : 'next';
	
	// Build classes once
	$classes = "post-navigation-link-$navigation_type";
	if ( isset( $attributes['textAlign'] ) ) {
		$classes .= " has-text-align-{$attributes['textAlign']}";
	}
	
	// Prepare wrapper attributes once
	$wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class' => $classes,
		)
	);
	
	// Set default values
	$format = '%link';
	$is_next = 'next' === $navigation_type;
	$link = $is_next ? _x( 'Next', 'label for next post link' ) : _x( 'Previous', 'label for previous post link' );
	$label = '';

	// Only use hardcoded arrow values
	static $arrow_map = array(
		'none'    => '',
		'arrow'   => array(
			'next'     => '→',
			'previous' => '←',
		),
		'chevron' => array(
			'next'     => '»',
			'previous' => '«',
		),
	);

	// Process label if provided
	if ( isset( $attributes['label'] ) && ! empty( $attributes['label'] ) ) {
		$label = $attributes['label'];
		$link = $label;
	}

	// Handle title display options
	if ( isset( $attributes['showTitle'] ) && $attributes['showTitle'] ) {
		$link_label = isset( $attributes['linkLabel'] ) && $attributes['linkLabel'];
		
		if ( ! $link_label ) {
			// Label as text, title as link
			if ( $label ) {
				$format = '<span class="post-navigation-link__label">' . wp_kses_post( $label ) . '</span> %link';
			}
			$link = '%title';
		} else {
			// Both label and title in link
			if ( $label ) {
				$link = '<span class="post-navigation-link__label">' . wp_kses_post( $label ) . '</span> <span class="post-navigation-link__title">%title</span>';
			} else {
				// Default label with colon
				$default_label = $is_next ? _x( 'Next:', 'label before the title of the next post' ) : _x( 'Previous:', 'label before the title of the previous post' );
				$link = sprintf(
					'<span class="post-navigation-link__label">%1$s</span> <span class="post-navigation-link__title">%2$s</span>',
					wp_kses_post( $default_label ),
					'%title'
				);
			}
		}
	}

	// Add arrow if needed
	$arrow_type = isset( $attributes['arrow'] ) ? $attributes['arrow'] : 'none';
	if ( 'none' !== $arrow_type && isset( $arrow_map[$arrow_type] ) ) {
		$arrow = $arrow_map[$arrow_type][$navigation_type];
		$arrow_html = sprintf(
			'<span class="wp-block-post-navigation-link__arrow-%1$s is-arrow-%2$s" aria-hidden="true">%3$s</span>',
			esc_attr( $navigation_type ),
			esc_attr( $arrow_type ),
			$arrow
		);
		
		$format = $is_next ? '%link' . $arrow_html : $arrow_html . '%link';
	}

	// Get link function name once
	$get_link_function = "get_{$navigation_type}_post_link";
	
	// Get the actual link content
	if ( ! empty( $attributes['taxonomy'] ) ) {
		$content = $get_link_function( $format, $link, true, '', $attributes['taxonomy'] );
	} else {
		$content = $get_link_function( $format, $link );
	}

	// Handle case when there's no adjacent post
	if ( empty( $content ) ) {
		$label_text = $is_next ? __( 'Next' ) : __( 'Previous' );
		
		// Setup arrow if needed
		$arrow_html = '';
		if ( 'none' !== $arrow_type && isset( $arrow_map[$arrow_type] ) ) {
			$arrow = $arrow_map[$arrow_type][$navigation_type];
			$arrow_html = sprintf(
				'<span class="wp-block-post-navigation-link__arrow-%1$s is-arrow-%2$s" aria-hidden="true">%3$s</span>',
				esc_attr( $navigation_type ),
				esc_attr( $arrow_type ),
				esc_html( $arrow )
			);
		}
		
		// Order elements based on direction
		$content = sprintf(
			'<span class="post-navigation-link__no-post">%1$s%2$s</span>',
			$is_next ? esc_html( $label_text ) : $arrow_html,
			$is_next ? $arrow_html : esc_html( $label_text )
		);
	}

	return sprintf(
		'<div %1$s>%2$s</div>',
		$wrapper_attributes,
		$content
	);
}

/**
 * Registers the `core/post-navigation-link` block on the server.
 *
 * @since 5.9.0
 */
function register_block_core_post_navigation_link() {
	register_block_type_from_metadata(
		__DIR__ . '/post-navigation-link',
		array(
			'render_callback' => 'render_block_core_post_navigation_link',
		)
	);
}
add_action( 'init', 'register_block_core_post_navigation_link' );