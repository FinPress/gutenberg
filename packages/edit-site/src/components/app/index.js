/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { privateApis as routerPrivateApis } from '@wordpress/router';
import { useCallback, useMemo } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/editor';

/**
 * Internal dependencies
 */
import Layout from '../layout';
import { unlock } from '../../lock-unlock';
import { store as editSiteStore } from '../../store';
import { useCommonCommands } from '../../hooks/commands/use-common-commands';
import useSetCommandContext from '../../hooks/commands/use-set-command-context';
import { useRegisterSiteEditorRoutes } from '../site-editor-routes';
import {
	currentlyPreviewingTheme,
	isPreviewingTheme,
} from '../../utils/is-previewing-theme';

const { RouterProvider } = unlock( routerPrivateApis );

function AppLayout() {
	useCommonCommands();
	useSetCommandContext();

	return <Layout />;
}

export default function App() {
	useRegisterSiteEditorRoutes();
	const { setEditedPost } = useDispatch( editorStore );
	const { routes, currentTheme, editorSettings } = useSelect( ( select ) => {
		return {
			routes: unlock( select( editSiteStore ) ).getRoutes(),
			currentTheme: select( coreStore ).getCurrentTheme(),
			// This is a temp solution until the has_theme_json value is available for the current theme.
			editorSettings: select( editSiteStore ).getSettings(),
		};
	}, [] );

	const beforeNavigate = useCallback(
		( { path, query } ) => {
			setEditedPost( null, null );
			if ( ! isPreviewingTheme() ) {
				return { path, query };
			}

			return {
				path,
				query: {
					...query,
					wp_theme_preview:
						'wp_theme_preview' in query
							? query.wp_theme_preview
							: currentlyPreviewingTheme(),
				},
			};
		},
		[ setEditedPost ]
	);

	const matchResolverArgsValue = useMemo(
		() => ( {
			siteData: { currentTheme, editorSettings },
		} ),
		[ currentTheme, editorSettings ]
	);

	return (
		<RouterProvider
			routes={ routes }
			pathArg="p"
			beforeNavigate={ beforeNavigate }
			matchResolverArgs={ matchResolverArgsValue }
		>
			<AppLayout />
		</RouterProvider>
	);
}
