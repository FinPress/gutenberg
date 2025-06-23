<?php
/**
 * Server-side rendering of the `core/post-excerpt` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/post-excerpt` block on the server.
 *
 * @since 5.8.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 * @return string Returns the filtered post excerpt for the current post wrapped inside "p" tags.
 */
function render_block_core_post_excerpt( $attributes, $content, $block ) {
	if ( ! isset( $block->context['postId'] ) ) {
		return '';
	}

	/*
	* The purpose of the excerpt length setting is to limit the length of both
	* automatically generated and user-created excerpts.
	* Because the excerpt_length filter only applies to auto generated excerpts,
	* wp_trim_words is used instead.
	*/
	$excerpt_length = $attributes['excerptLength'];
	$excerpt        = get_the_excerpt( $block->context['postId'] );
	if ( isset( $excerpt_length ) ) {
		$excerpt = block_core_post_excerpt_trim_words( $excerpt, $excerpt_length );
	}

	$more_text           = ! empty( $attributes['moreText'] ) ? '<a class="wp-block-post-excerpt__more-link" href="' . esc_url( get_the_permalink( $block->context['postId'] ) ) . '">' . wp_kses_post( $attributes['moreText'] ) . '</a>' : '';
	$filter_excerpt_more = static function ( $more ) use ( $more_text ) {
		return empty( $more_text ) ? $more : '';
	};
	/**
	 * Some themes might use `excerpt_more` filter to handle the
	 * `more` link displayed after a trimmed excerpt. Since the
	 * block has a `more text` attribute we have to check and
	 * override if needed the return value from this filter.
	 * So if the block's attribute is not empty override the
	 * `excerpt_more` filter and return nothing. This will
	 * result in showing only one `read more` link at a time.
	 */
	add_filter( 'excerpt_more', $filter_excerpt_more );
	$classes = array();
	if ( isset( $attributes['textAlign'] ) ) {
		$classes[] = 'has-text-align-' . $attributes['textAlign'];
	}
	if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
		$classes[] = 'has-link-color';
	}
	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classes ) ) );

	$content               = '<p class="wp-block-post-excerpt__excerpt">' . $excerpt;
	$show_more_on_new_line = ! isset( $attributes['showMoreOnNewLine'] ) || $attributes['showMoreOnNewLine'];
	if ( $show_more_on_new_line && ! empty( $more_text ) ) {
		$content .= '</p><p class="wp-block-post-excerpt__more-text">' . $more_text . '</p>';
	} else {
		$content .= " $more_text</p>";
	}
	remove_filter( 'excerpt_more', $filter_excerpt_more );
	return sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $content );
}

/**
 * Trims text to a given number of words, preserving newlines.
 *
 * Similar to wp_trim_words(), but avoids stripping line breaks and HTML <br> tags.
 *
 * @since 21.0.0
 *
 * @param  string $text The text to trim.
 * @param  int    $num_words The maximum number of words. Default 55.
 * @param  string $more Optional. What to append if the text is trimmed. Default '…'.
 * @return string The trimmed text with newlines preserved.
 */
function block_core_post_excerpt_trim_words( $text, $num_words = 55, $more = null ) {
	if ( null === $more ) {
		$more = __( '&hellip;' );
	}

	// Replace <br> tags with newlines temporarily,
	// to retain manual breaks from editors.
	$text      = str_replace( array( '<br>', '<br/>', '<br />' ), "\n", $text );
	$text      = strip_tags( $text );
	$num_words = (int) $num_words;

	if (
		str_starts_with( wp_get_word_count_type(), 'characters' ) &&
		preg_match( '/^utf\-?8$/i', get_option( 'blog_charset' ) )
	) {
		$text = trim( preg_replace( "/[^\S\n\r]+/", ' ', $text ), ' ' );
		preg_match_all( '/./u', $text, $words_array );
		$words_array = array_slice( $words_array[0], 0, $num_words + 1 );
		$sep         = '';
	} else {
		$words_array = preg_split( '/([ \t]+)/', $text, $num_words + 1, PREG_SPLIT_NO_EMPTY );
		$sep         = ' ';
	}

	if ( count( $words_array ) > $num_words ) {
		array_pop( $words_array );
		$text = implode( $sep, $words_array ) . $more;
	} else {
		$text = implode( $sep, $words_array );
	}

	return nl2br( $text );
}

/**
 * Registers the `core/post-excerpt` block on the server.
 *
 * @since 5.8.0
 */
function register_block_core_post_excerpt() {
	register_block_type_from_metadata(
		__DIR__ . '/post-excerpt',
		array(
			'render_callback' => 'render_block_core_post_excerpt',
		)
	);
}
add_action( 'init', 'register_block_core_post_excerpt' );

/**
 * If themes or plugins filter the excerpt_length, we need to
 * override the filter in the editor, otherwise
 * the excerpt length block setting has no effect.
 * Returns 100 because 100 is the max length in the setting.
 */
if ( is_admin() ||
	defined( 'REST_REQUEST' ) && REST_REQUEST ) {
	add_filter(
		'excerpt_length',
		static function () {
			return 100;
		},
		PHP_INT_MAX
	);
}
