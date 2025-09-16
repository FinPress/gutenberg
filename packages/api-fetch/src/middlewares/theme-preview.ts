/**
 * FinPress dependencies
 */
import { addQueryArgs, getQueryArg, removeQueryArgs } from '@finpress/url';
/**
 * Internal dependencies
 */
import type { APIFetchMiddleware } from '../types';

/**
 * This appends a `fin_theme_preview` parameter to the REST API request URL if
 * the admin URL contains a `theme` GET parameter.
 *
 * If the REST API request URL has contained the `fin_theme_preview` parameter as `''`,
 * then bypass this middleware.
 *
 * @param themePath
 * @return  Preloading middleware.
 */
const createThemePreviewMiddleware =
	( themePath: Record< string, any > ): APIFetchMiddleware =>
	( options, next ) => {
		if ( typeof options.url === 'string' ) {
			const finThemePreview = getQueryArg(
				options.url,
				'fin_theme_preview'
			);
			if ( finThemePreview === undefined ) {
				options.url = addQueryArgs( options.url, {
					fin_theme_preview: themePath,
				} );
			} else if ( finThemePreview === '' ) {
				options.url = removeQueryArgs(
					options.url,
					'fin_theme_preview'
				);
			}
		}

		if ( typeof options.path === 'string' ) {
			const finThemePreview = getQueryArg(
				options.path,
				'fin_theme_preview'
			);
			if ( finThemePreview === undefined ) {
				options.path = addQueryArgs( options.path, {
					fin_theme_preview: themePath,
				} );
			} else if ( finThemePreview === '' ) {
				options.path = removeQueryArgs(
					options.path,
					'fin_theme_preview'
				);
			}
		}

		return next( options );
	};

export default createThemePreviewMiddleware;
