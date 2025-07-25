<?php
/**
 * Server-side rendering of the `core/todo` block.
 *
 * @package WordPress
 */

/**
 * Renders the `todo` block on the server.
 *
 * @since 6.8.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 *
 * @return string The rendered block content.
 */
function render_block_core_todo( $attributes, $content, $block ) {
	$wrapper_attributes = get_block_wrapper_attributes();
	$current_user       = wp_get_current_user();
	$post               = get_post();
	$allowed_roles      = $attributes['allowedRoles'] ?? array();
	$todos              = $attributes['isGlobal'] ? get_post_meta( $post->ID, 'global_todos', true ) : $attributes['todos'] ?? array();
	$color              = $attributes['checkboxColor'] ?? '#000000';
	$checkbox_size      = $attributes['checkboxSize'];
	$can_toggle         = false;
	if ( array_intersect( array( 'all' ), $allowed_roles ) ) {
		$can_toggle = true;
	} else {
		$can_toggle = false;
		foreach ( $allowed_roles as $role ) {
			if ( array_intersect( array( strtolower( $role['name'] ) ), $current_user->roles ) ) {
				$can_toggle = true;
				break;
			}
		}
	}

	if ( true === $can_toggle && $attributes['isGlobal'] && ( ! current_user_can( 'edit_post', $post->ID ) || ! get_post_field( 'post_author', $post->ID ) === get_current_user_id() ) ) {
		$can_toggle = false;
	}

	if ( $attributes['isGlobal'] && $can_toggle ) {
		wp_register_script(
			'core-todo-view',
			'/wp-content/plugins/gutenberg/packages/block-library/src/todo/view.js',
			array(
				'wp-data',
				'wp-core-data',
			),
			filemtime( '/wp-content/plugins/gutenberg/packages/block-library/src/todo/view.js' ),
			true
		);
		wp_localize_script(
			'core-todo-view',
			'todoData',
			array(
				'todos'    => $todos,
				'postId'   => $post->ID,
				'postType' => $block->context['postType'],
			)
		);
		wp_enqueue_script( 'core-todo-view' );
	}

	$style = sprintf(
		'accent-color: %1$s; width: %2$s; height: %2$s;',
		esc_attr( $color ),
		esc_attr( $checkbox_size )
	);

	$block_content = '';

	foreach ( $todos as $index => $todo ) {
		$block_content .= sprintf(
			'<div class="todo-item">
			<input
				type="checkbox"
				data-index="%1$s"
				data-key="todo-%2$s"
				style="%3$s"
				%4$s
				%5$s
			/>
			<span>%6$s</span>
		</div>',
			$index,
			$index,
			$style,
			checked( $todo['completed'], true, false ),
			disabled( $can_toggle, false, false ),
			$todo['text']
		);
	}
	if ( ! $attributes['isGlobal'] ) {
		$block_content .= '<script>
		document.addEventListener( "DOMContentLoaded", () => {
			const checkboxes = document.querySelectorAll("[data-todo-list] input[type=\"checkbox\"]");

			checkboxes.forEach((checkbox) => {
				const key = checkbox.dataset.key;
				const saved = localStorage.getItem(key);
				if (saved !== null) {
					checkbox.checked = saved === "true";
				}

				checkbox.addEventListener("change", () => {
					localStorage.setItem(key, checkbox.checked);
				});
			});
		});
	</script>';
	}
	return sprintf( '<div %1$s data-todo-list>%2$s</div>', $wrapper_attributes, $block_content );
}

/**
 * Registers the `todo` block.
 *
 * @since 6.8.0
 */
function register_block_core_todo() {
	register_block_type_from_metadata(
		__DIR__ . '/todo',
		array(
			'render_callback' => 'render_block_core_todo',
		)
	);

	$post_types = get_post_types( array( 'public' => true ), 'names' );
	foreach ( $post_types as $post_type ) {
		register_post_meta(
			$post_type,
			'global_todos',
			array(
				'type'          => 'array',
				'single'        => true,
				'show_in_rest'  => array(
					'schema' => array(
						'type'  => 'array',
						'items' => array(
							'type'       => 'object',
							'properties' => array(
								'text'      => array( 'type' => 'string' ),
								'completed' => array( 'type' => 'boolean' ),
							),
						),
					),
				),
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
}
add_action( 'init', 'register_block_core_todo' );
