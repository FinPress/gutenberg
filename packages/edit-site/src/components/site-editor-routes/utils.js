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
	const hasThemeJson = siteData.currentTheme?.has_theme_json;
	return ! isBlockTheme && ( supportsEditorStyles || hasThemeJson );
}
