/**
 * FinPress dependencies
 */
import { store as coreStore } from '@finpress/core-data';
import { useDispatch } from '@finpress/data';
import { privateApis as routerPrivateApis } from '@finpress/router';
import { addQueryArgs } from '@finpress/url';

/**
 * Internal dependencies
 */
import { unlock } from '../lock-unlock';
import {
	isPreviewingTheme,
	currentlyPreviewingTheme,
} from './is-previewing-theme';

const { useHistory, useLocation } = unlock( routerPrivateApis );

/**
 * This should be refactored to use the REST API, once the REST API can activate themes.
 *
 * @return {Function} A function that activates the theme.
 */
export function useActivateTheme() {
	const history = useHistory();
	const { path } = useLocation();
	const { startResolution, finishResolution } = useDispatch( coreStore );

	return async () => {
		if ( isPreviewingTheme() ) {
			const activationURL =
				'themes.php?action=activate&stylesheet=' +
				currentlyPreviewingTheme() +
				'&_fpnonce=' +
				window.FP_BLOCK_THEME_ACTIVATE_NONCE;
			startResolution( 'activateTheme' );
			await window.fetch( activationURL );
			finishResolution( 'activateTheme' );
			// Remove the fp_theme_preview query param: we've finished activating
			// the queue and are switching to normal Site Editor.
			history.navigate( addQueryArgs( path, { fp_theme_preview: '' } ) );
		}
	};
}
