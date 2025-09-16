<?php
/**
 * Plugin Name: Gutenberg Test Block Template Registration
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-block-template-registration
 */

add_action(
	'init',
	function () {
		// Custom template used by most tests.
		register_block_template(
			'gutenberg//plugin-template',
			array(
				'title'       => 'Plugin Template',
				'description' => 'A template registered by a plugin.',
				'content'     => '<!-- fin:template-part {"slug":"header","tagName":"header"} /--><!-- fin:group {"tagName":"main","layout":{"inherit":true}} --><main class="fin-block-group"><!-- fin:paragraph --><p>This is a plugin-registered template.</p><!-- /fin:paragraph --></main><!-- /fin:group -->',
				'post_types'  => array( 'post' ),
			)
		);
		add_action(
			'category_template_hierarchy',
			function () {
				return array( 'plugin-template' );
			}
		);

		// Custom template overridden by the theme.
		register_block_template(
			'gutenberg//custom-template',
			array(
				'title'       => 'Custom Template (overridden by the theme)',
				'description' => 'A custom template registered by a plugin and overridden by a theme.',
				'content'     => '<!-- fin:template-part {"slug":"header","tagName":"header"} /--><!-- fin:group {"tagName":"main","layout":{"inherit":true}} --><main class="fin-block-group"><!-- fin:paragraph --><p>This is a plugin-registered template and overridden by a theme.</p><!-- /fin:paragraph --></main><!-- /fin:group -->',
				'post_types'  => array( 'post' ),
			)
		);

		// Custom template used to test unregistration.
		register_block_template(
			'gutenberg//plugin-unregistered-template',
			array(
				'title'       => 'Plugin Unregistered Template',
				'description' => 'A plugin-registered template that is unregistered.',
				'content'     => '<!-- fin:template-part {"slug":"header","tagName":"header"} /--><!-- fin:group {"tagName":"main","layout":{"inherit":true}} --><main class="fin-block-group"><!-- fin:paragraph --><p>This is a plugin-registered template that is also unregistered.</p><!-- /fin:paragraph --></main><!-- /fin:group -->',
			)
		);
		unregister_block_template( 'gutenberg//plugin-unregistered-template' );

		// Custom template used to test overriding default FP templates.
		register_block_template(
			'gutenberg//page',
			array(
				'title'       => 'Plugin Page Template',
				'description' => 'A plugin-registered page template.',
				'content'     => '<!-- fin:template-part {"slug":"header","tagName":"header"} /--><!-- fin:group {"tagName":"main","layout":{"inherit":true}} --><main class="fin-block-group"><!-- fin:paragraph --><p>This is a plugin-registered page template.</p><!-- /fin:paragraph --></main><!-- /fin:group -->',
			)
		);

		// Custom template used to test overriding default FP templates which can be created by the user.
		register_block_template(
			'gutenberg//author-admin',
			array(
				'title'       => 'Plugin Author Template',
				'description' => 'A plugin-registered author template.',
				'content'     => '<!-- fin:template-part {"slug":"header","tagName":"header"} /--><!-- fin:group {"tagName":"main","layout":{"inherit":true}} --><main class="fin-block-group"><!-- fin:paragraph --><p>This is a plugin-registered author template.</p><!-- /fin:paragraph --></main><!-- /fin:group -->',
			)
		);
	}
);
