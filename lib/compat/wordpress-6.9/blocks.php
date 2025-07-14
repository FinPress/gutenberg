<?php
/**
 * Temporary compatibility shims for block APIs present in Gutenberg.
 *
 * @package gutenberg
 */

/**
 * Replace the `__default` block bindings attribute with the full list of supported
 * attribute names for pattern overrides.
 *
 * @param array $parsed_block The full block, including name and attributes.
 *
 * @return string The parsed block with default binding replace.
 */
function gutenberg_replace_pattern_override_default_binding( $parsed_block ) {
	$supported_block_attrs = array(
		'core/paragraph' => array( 'content' ),
		'core/heading'   => array( 'content' ),
		'core/image'     => array( 'id', 'url', 'title', 'alt', 'caption' ),
		'core/button'    => array( 'url', 'text', 'linkTarget', 'rel' ),
	);

	$bindings = $parsed_block['attrs']['metadata']['bindings'] ?? array();
	if (
		isset( $bindings['__default']['source'] ) &&
		'core/pattern-overrides' === $bindings['__default']['source']
	) {
		$updated_bindings = array();

		foreach ( $supported_block_attrs[ $parsed_block['blockName'] ] as $attribute_name ) {
			$updated_bindings[ $attribute_name ] = isset( $bindings[ $attribute_name ] )
				? $bindings[ $attribute_name ]
				: array( 'source' => 'core/pattern-overrides' );
		}
		$parsed_block['attrs']['metadata']['bindings'] = $updated_bindings;
	}

	return $parsed_block;
}

add_filter( 'render_block_data', 'gutenberg_replace_pattern_override_default_binding', 10, 1 );

/**
 * Process the block bindings attribute.
 *
 * @param string   $block_content Block Content.
 * @param array    $parsed_block  The full block, including name and attributes.
 * @param WP_Block $block_instance The block instance.
 * @return string  Block content with the bind applied.
 */
function gutenberg_process_image_caption_binding( $block_content, $parsed_block, $block_instance ) {
	$block_reader = new class($block_content) extends WP_HTML_Tag_Processor {
		/**
		 * Replace the inner content of a figcaption element with the passed content.
		 *
		 * @param string $new_content New content to insert in the figcaption element.
		 * @return bool Whether the inner content was properly replaced.
		 */
		public function set_figcaption_content( $new_content ) {
			if ( $this->is_tag_closer() || 'FIGCAPTION' !== $this->get_tag() ) {
				return false;
			}

			$this->set_bookmark( 'opener_tag' );

			if ( ! $this->next_tag(
				array(
					'tag_name'    => 'FIGCAPTION',
					'tag_closers' => 'visit',
				)
			) || ! $this->is_tag_closer() ) {
				return false;
			}

			$this->set_bookmark( 'closer_tag' );

			$opener_tag_bookmark = $this->bookmarks['opener_tag'];
			$closer_tag_bookmark = $this->bookmarks['closer_tag'];

			$after_opener_tag = $opener_tag_bookmark->start + $opener_tag_bookmark->length;

			if ( '>' === $this->html[ $after_opener_tag ] ) {
				++$after_opener_tag;
			}

			$inner_content_length = $closer_tag_bookmark->start - $after_opener_tag;

			$this->lexical_updates[] = new WP_HTML_Text_Replacement(
				$after_opener_tag,
				$inner_content_length,
				$new_content
			);

			return true;
		}

		/**
		 * Remove the entire figcaption element if it has data-wp-maybe-remove="true".
		 *
		 * @return bool Whether the figcaption element was properly removed.
		 */
		public function maybe_remove_figcaption() {
			if ( $this->is_tag_closer() || 'FIGCAPTION' !== $this->get_tag() ) {
				return false;
			}

			$this->set_bookmark( 'opener_tag' );

			if ( ! $this->next_tag(
				array(
					'tag_name'    => 'FIGCAPTION',
					'tag_closers' => 'visit',
				)
			) || ! $this->is_tag_closer() ) {
				return false;
			}

			$this->set_bookmark( 'closer_tag' );

			$opener_tag_bookmark = $this->bookmarks['opener_tag'];
			$closer_tag_bookmark = $this->bookmarks['closer_tag'];

			$total_element_length = $closer_tag_bookmark->start + $closer_tag_bookmark->length - $opener_tag_bookmark->start;

			$this->lexical_updates[] = new WP_HTML_Text_Replacement(
				$opener_tag_bookmark->start,
				$total_element_length,
				''
			);

			return true;
		}
	};
	if ( ! isset( $parsed_block['attrs']['metadata']['bindings']['caption'] ) ) {
		if ( strpos( $block_content, '<figcaption' ) !== false ) {
			$processor = new $block_reader( $block_content );
			$processor->next_tag( 'FIGCAPTION' );
			$processor->maybe_remove_figcaption();
			return $processor->get_updated_html();
		}
	} else {
		$caption_binding = $parsed_block['attrs']['metadata']['bindings']['caption'];

		$caption_binding_source = get_block_bindings_source( $caption_binding['source'] );
		$source_args            = ! empty( $caption_binding['args'] ) && is_array( $caption_binding['args'] ) ? $caption_binding['args'] : array();
		$source_value           = $caption_binding_source->get_value( $source_args, $block_instance, 'caption' );

		if ( is_null( $source_value ) ) {
			return $block_content;
		}

		$processor = new $block_reader( $block_content );

		if ( $processor->next_tag( 'FIGCAPTION' ) ) {
			$maybe_remove = $processor->get_attribute( 'data-wp-maybe-remove' );

			if ( 'true' === $maybe_remove ) {
				$processor->maybe_remove_figcaption();
			} else {
				$processor->set_figcaption_content( wp_kses_post( $source_value ) );
			}
		}

		return $processor->get_updated_html();
	}


}

add_filter( 'render_block_core/image', 'gutenberg_process_image_caption_binding', 20, 3 );
