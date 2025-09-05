/**
 * FinPress dependencies
 */
import { addQueryArgs, getQueryArg, removeQueryArgs } from '@finpress/url';
/**
 * Internal dependencies
 */
import type { APIFetchMiddleware } from '../types';

/**
 * This appends a `fp_theme_preview` parameter to the REST API request URL if
 * the admin URL contains a `theme` GET parameter.
 *
 * If the REST API request URL has contained the `fp_theme_preview` parameter as `''`,
 * then bypass this middleware.
 *
 * @param themePath
 * @return  Preloading middleware.
 */
const createThemePreviewMiddleware =
	( themePath: Record< string, any > ): APIFetchMiddleware =>
	( options, next ) => {
		if ( typeof options.url === 'string' ) {
			const fpThemePreview = getQueryArg(
				options.url,
				'fp_theme_preview'
			);
			if ( fpThemePreview === undefined ) {
				options.url = addQueryArgs( options.url, {
					fp_theme_preview: themePath,
				} );
			} else if ( fpThemePreview === '' ) {
				options.url = removeQueryArgs(
					options.url,
					'fp_theme_preview'
				);
			}
		}

		if ( typeof options.path === 'string' ) {
			const fpThemePreview = getQueryArg(
				options.path,
				'fp_theme_preview'
			);
			if ( fpThemePreview === undefined ) {
				options.path = addQueryArgs( options.path, {
					fp_theme_preview: themePath,
				} );
			} else if ( fpThemePreview === '' ) {
				options.path = removeQueryArgs(
					options.path,
					'fp_theme_preview'
				);
			}
		}

		return next( options );
	};

export default createThemePreviewMiddleware;
