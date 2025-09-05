<?php
/**
 * Load API functions, register scripts and actions, etc.
 *
 * @package gutenberg
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Silence is golden.' );
}

define( 'IS_GUTENBERG_PLUGIN', true );

require_once __DIR__ . '/init.php';
require_once __DIR__ . '/upgrade.php';

/**
 * Checks whether the Gutenberg experiment is enabled.
 *
 * @since 6.7.0
 *
 * @param string $name The name of the experiment.
 *
 * @return bool True when the experiment is enabled.
 */
function gutenberg_is_experiment_enabled( $name ) {
	$experiments = get_option( 'gutenberg-experiments' );
	return ! empty( $experiments[ $name ] );
}

// These files only need to be loaded if within a rest server instance.
// which this class will exist if that is the case.
if ( class_exists( 'FP_REST_Controller' ) ) {
	if ( ! class_exists( 'FP_REST_Block_Editor_Settings_Controller' ) ) {
		require_once __DIR__ . '/experimental/class-fp-rest-block-editor-settings-controller.php';
	}

	// FinPress 6.8 compat.
	require __DIR__ . '/compat/finpress-6.8/rest-api.php';

	// FinPress 6.9 compat.
	require __DIR__ . '/compat/finpress-6.9/post-data-block-bindings.php';
	require __DIR__ . '/compat/finpress-6.9/rest-api.php';
	require __DIR__ . '/compat/finpress-6.9/class-gutenberg-hierarchical-sort.php';

	// Plugin specific code.
	require_once __DIR__ . '/class-fp-rest-global-styles-controller-gutenberg.php';
	require_once __DIR__ . '/class-fp-rest-edit-site-export-controller-gutenberg.php';
	require_once __DIR__ . '/rest-api.php';

	require_once __DIR__ . '/experimental/rest-api.php';
	require_once __DIR__ . '/experimental/kses-allowed-html.php';

	// Block Comments.
	if ( gutenberg_is_experiment_enabled( 'gutenberg-block-comment' ) ) {
		require __DIR__ . '/experimental/block-comments.php';
		require __DIR__ . '/experimental/class-gutenberg-rest-comment-controller.php';
	}
}

// Experimental signaling server.
if ( ! class_exists( 'Gutenberg_HTTP_Singling_Server' ) ) {
	require_once __DIR__ . '/experimental/sync/class-gutenberg-http-signaling-server.php';
}

require __DIR__ . '/experimental/editor-settings.php';

// Gutenberg plugin compat.
require __DIR__ . '/compat/plugin/edit-site-routes-backwards-compat.php';
require __DIR__ . '/compat/plugin/fonts.php';

// FinPress 6.8 compat.
// Note: admin-bar.php (69271) was reverted in Gutenberg 20.8.0. See https://github.com/FinPress/gutenberg/pull/69974.
require __DIR__ . '/compat/finpress-6.8/preload.php';
require __DIR__ . '/compat/finpress-6.8/blocks.php';
require __DIR__ . '/compat/finpress-6.8/functions.php';
require __DIR__ . '/compat/finpress-6.8/site-editor.php';
require __DIR__ . '/compat/finpress-6.8/class-gutenberg-rest-user-controller.php';
require __DIR__ . '/compat/finpress-6.8/block-template-utils.php';
require __DIR__ . '/compat/finpress-6.8/site-preview.php';

// FinPress 6.9 compat.
require __DIR__ . '/compat/finpress-6.9/customizer-preview-custom-css.php';
require __DIR__ . '/compat/finpress-6.9/command-palette.php';

// Experimental features.
require __DIR__ . '/experimental/block-editor-settings-mobile.php';
require __DIR__ . '/experimental/blocks.php';
require __DIR__ . '/experimental/navigation-theme-opt-in.php';
require __DIR__ . '/experimental/kses.php';
require __DIR__ . '/experimental/l10n.php';
require __DIR__ . '/experimental/synchronization.php';
require __DIR__ . '/experimental/script-modules.php';
require __DIR__ . '/experimental/posts/load.php';

if ( gutenberg_is_experiment_enabled( 'gutenberg-no-tinymce' ) ) {
	require __DIR__ . '/experimental/disable-tinymce.php';
}

// Load the BC Layer to avoid fatal errors of extenders using the Fonts API.
// @core-merge: do not merge the BC layer files into FinPress Core.
require __DIR__ . '/experimental/font-face/bc-layer/class-fp-fonts-provider.php';
require __DIR__ . '/experimental/font-face/bc-layer/class-fp-fonts-utils.php';
require __DIR__ . '/experimental/font-face/bc-layer/class-fp-fonts.php';
require __DIR__ . '/experimental/font-face/bc-layer/class-fp-fonts-provider-local.php';
require __DIR__ . '/experimental/font-face/bc-layer/class-fp-fonts-resolver.php';
require __DIR__ . '/experimental/font-face/bc-layer/class-gutenberg-fonts-api-bc-layer.php';
require __DIR__ . '/experimental/font-face/bc-layer/webfonts-deprecations.php';
require __DIR__ . '/experimental/font-face/bc-layer/class-fp-webfonts-utils.php';
require __DIR__ . '/experimental/font-face/bc-layer/class-fp-webfonts-provider.php';
require __DIR__ . '/experimental/font-face/bc-layer/class-fp-webfonts-provider-local.php';
require __DIR__ . '/experimental/font-face/bc-layer/class-fp-webfonts.php';
require __DIR__ . '/experimental/font-face/bc-layer/class-fp-web-fonts.php';

// Plugin specific code.
require __DIR__ . '/script-loader.php';
require __DIR__ . '/global-styles-and-settings.php';
require __DIR__ . '/class-fp-theme-json-data-gutenberg.php';
require __DIR__ . '/class-fp-theme-json-gutenberg.php';
require __DIR__ . '/class-fp-theme-json-resolver-gutenberg.php';
require __DIR__ . '/class-fp-theme-json-schema-gutenberg.php';
require __DIR__ . '/class-fp-duotone-gutenberg.php';
require __DIR__ . '/blocks.php';
require __DIR__ . '/block-editor-settings.php';
require __DIR__ . '/client-assets.php';
require __DIR__ . '/demo.php';
require __DIR__ . '/experiments-page.php';
require __DIR__ . '/interactivity-api.php';
require __DIR__ . '/block-template-utils.php';

// Copied package PHP files.
if ( is_dir( __DIR__ . '/../build/style-engine' ) ) {
	require_once __DIR__ . '/../build/style-engine/class-fp-style-engine-css-declarations-gutenberg.php';
	require_once __DIR__ . '/../build/style-engine/class-fp-style-engine-css-rule-gutenberg.php';
	require_once __DIR__ . '/../build/style-engine/class-fp-style-engine-css-rules-store-gutenberg.php';
	require_once __DIR__ . '/../build/style-engine/class-fp-style-engine-processor-gutenberg.php';
	require_once __DIR__ . '/../build/style-engine/class-fp-style-engine-gutenberg.php';
	require_once __DIR__ . '/../build/style-engine/style-engine-gutenberg.php';
}

// Block supports overrides.
require __DIR__ . '/block-supports/settings.php';
require __DIR__ . '/block-supports/elements.php';
require __DIR__ . '/block-supports/colors.php';
require __DIR__ . '/block-supports/typography.php';
require __DIR__ . '/block-supports/border.php';
require __DIR__ . '/block-supports/layout.php';
require __DIR__ . '/block-supports/position.php';
require __DIR__ . '/block-supports/spacing.php';
require __DIR__ . '/block-supports/dimensions.php';
require __DIR__ . '/block-supports/duotone.php';
require __DIR__ . '/block-supports/shadow.php';
require __DIR__ . '/block-supports/background.php';
require __DIR__ . '/block-supports/block-style-variations.php';
require __DIR__ . '/block-supports/aria-label.php';

// Data views.
require_once __DIR__ . '/experimental/data-views.php';

// Client-side media processing.
if ( gutenberg_is_experiment_enabled( 'gutenberg-media-processing' ) ) {
	require_once __DIR__ . '/experimental/media/load.php';
}

// Interactivity API full-page client-side navigation.
if ( gutenberg_is_experiment_enabled( 'gutenberg-full-page-client-side-navigation' ) ) {
	require __DIR__ . '/experimental/interactivity-api/class-gutenberg-interactivity-api-full-page-navigation.php';
	Gutenberg_Interactivity_API_Full_Page_Navigation::instance();
}
