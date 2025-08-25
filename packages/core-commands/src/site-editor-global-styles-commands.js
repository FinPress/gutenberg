/**
 * WordPress dependencies
 */
import { useCommandLoader } from '@wordpress/commands';
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { getPath, addQueryArgs } from '@wordpress/url';
import { styles, brush, backup, external } from '@wordpress/icons';
import { privateApis as routerPrivateApis } from '@wordpress/router';

/**
 * Internal dependencies
 */
import { unlock } from './lock-unlock';

const { useHistory } = unlock( routerPrivateApis );

const getGlobalStylesNavigationCommands = () =>
	function useGlobalStylesNavigationCommands() {
		const history = useHistory();
		const isSiteEditor = getPath( window.location.href )?.includes(
			'site-editor.php'
		);

		const {
			isBlockBasedTheme,
			canCreateTemplate,
			canEditCSS,
			hasRevisions,
		} = useSelect( ( select ) => {
			const {
				getCurrentTheme,
				canUser,
				getEntityRecord,
				__experimentalGetCurrentGlobalStylesId,
			} = select( coreStore );

			const globalStylesId = __experimentalGetCurrentGlobalStylesId();
			const globalStyles = globalStylesId
				? getEntityRecord( 'root', 'globalStyles', globalStylesId )
				: undefined;

			return {
				isBlockBasedTheme: getCurrentTheme()?.is_block_theme,
				canCreateTemplate: canUser( 'create', {
					kind: 'postType',
					name: 'wp_template',
				} ),
				canEditCSS: !! globalStyles?._links?.[ 'wp:action-edit-css' ],
				hasRevisions:
					!! globalStyles?._links?.[ 'version-history' ]?.[ 0 ]
						?.count,
			};
		}, [] );

		const commands = useMemo( () => {
			// Only show site editor commands to users who can access it and in block themes
			if ( ! canCreateTemplate || ! isBlockBasedTheme ) {
				return [];
			}

			const result = [];

			// Go to Styles command
			result.push( {
				name: 'core/go-to-styles',
				label: __( 'Go to Styles' ),
				icon: styles,
				callback: ( { close } ) => {
					close();
					if ( isSiteEditor ) {
						history.navigate( '/styles' );
					} else {
						document.location = addQueryArgs( 'site-editor.php', {
							p: '/styles',
						} );
					}
				},
			} );

			// Go to custom CSS command
			if ( canEditCSS ) {
				result.push( {
					name: 'core/go-to-custom-css',
					label: __( 'Go to custom CSS' ),
					icon: brush,
					callback: ( { close } ) => {
						close();
						if ( isSiteEditor ) {
							history.navigate(
								'/styles?canvas=edit&section=css'
							);
						} else {
							document.location = addQueryArgs(
								'site-editor.php',
								{
									p: '/styles',
									canvas: 'edit',
									section: 'css',
								}
							);
						}
					},
				} );
			}

			// Open style revisions command
			if ( hasRevisions ) {
				result.push( {
					name: 'core/open-style-revisions',
					label: __( 'Open style revisions' ),
					icon: backup,
					callback: ( { close } ) => {
						close();
						if ( isSiteEditor ) {
							history.navigate(
								'/styles?canvas=edit&section=revisions'
							);
						} else {
							document.location = addQueryArgs(
								'site-editor.php',
								{
									p: '/styles',
									canvas: 'edit',
									section: 'revisions',
								}
							);
						}
					},
				} );
			}

			return result;
		}, [
			canCreateTemplate,
			isBlockBasedTheme,
			canEditCSS,
			hasRevisions,
			history,
			isSiteEditor,
		] );

		return {
			isLoading: false,
			commands,
		};
	};

const getViewSiteCommand = () =>
	function useViewSiteCommand() {
		const homeUrl = useSelect( ( select ) => {
			// Site index.
			return select( coreStore ).getEntityRecord(
				'root',
				'__unstableBase'
			)?.home;
		}, [] );

		const commands = useMemo( () => {
			if ( ! homeUrl ) {
				return [];
			}

			return [
				{
					name: 'core/view-site',
					label: __( 'View site' ),
					icon: external,
					callback: ( { close } ) => {
						close();
						window.open( homeUrl, '_blank' );
					},
				},
			];
		}, [ homeUrl ] );

		return {
			isLoading: false,
			commands,
		};
	};

export function useSiteEditorGlobalStylesCommands() {
	useCommandLoader( {
		name: 'core/global-styles-navigation',
		hook: getGlobalStylesNavigationCommands(),
	} );

	useCommandLoader( {
		name: 'core/view-site',
		hook: getViewSiteCommand(),
	} );
}
