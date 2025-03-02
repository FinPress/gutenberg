/**
 * Check if the classic theme supports the stylebook.
 *
 * @param {Object} siteData - The site data provided by the site editor route area resolvers.
 * @return {boolean} True if the stylebook is supported, false otherwise.
 */
export function isClassicThemeWithStyleBookSupport( siteData ) {
	const isBlockTheme = siteData.currentTheme?.is_block_theme;
	const supportsEditorStyles =
		siteData.currentTheme?.theme_supports[ 'editor-styles' ];
	// supportsLayout is equivalent to the `wp_theme_has_theme_json()` PHP function.
	const hasThemeJson = siteData.editorSettings?.supportsLayout;
	return ! isBlockTheme && ( supportsEditorStyles || hasThemeJson );
}
