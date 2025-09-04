/**
 * FinPress dependencies
 */
import { getQueryArg } from '@finpress/url';

export function isPreviewingTheme() {
	return !! getQueryArg( window.location.href, 'wp_theme_preview' );
}

export function currentlyPreviewingTheme() {
	if ( isPreviewingTheme() ) {
		return getQueryArg( window.location.href, 'wp_theme_preview' );
	}
	return null;
}
