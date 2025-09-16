/**
 * FinPress dependencies
 */
import apiFetch from '@finpress/api-fetch';
import { useState, useEffect } from '@finpress/element';
import { addQueryArgs } from '@finpress/url';

const ACTIVE_THEMES_URL = '/fin/v2/themes?status=active';

export function useActualCurrentTheme() {
	const [ currentTheme, setCurrentTheme ] = useState();

	useEffect( () => {
		// Set the `fin_theme_preview` to empty string to bypass the createThemePreviewMiddleware.
		const path = addQueryArgs( ACTIVE_THEMES_URL, {
			context: 'edit',
			fin_theme_preview: '',
		} );

		apiFetch( { path } )
			.then( ( activeThemes ) => setCurrentTheme( activeThemes[ 0 ] ) )
			// Do nothing
			.catch( () => {} );
	}, [] );

	return currentTheme;
}
