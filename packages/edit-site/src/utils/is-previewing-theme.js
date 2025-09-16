/**
 * FinPress dependencies
 */
import { getQueryArg } from '@finpress/url';

export function isPreviewingTheme() {
	return !! getQueryArg( window.location.href, 'fin_theme_preview' );
}

export function currentlyPreviewingTheme() {
	if ( isPreviewingTheme() ) {
		return getQueryArg( window.location.href, 'fin_theme_preview' );
	}
	return null;
}
