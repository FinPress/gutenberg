/**
 * WordPress dependencies
 */
import { useCommand, useCommandLoader } from '@wordpress/commands';
import { __, sprintf } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';
import { getPath } from '@wordpress/url';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect, useDispatch } from '@wordpress/data';
import { useCallback, useMemo } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import { privateApis as routerPrivateApis } from '@wordpress/router';
import { Dashicon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { unlock } from './lock-unlock';

const { useHistory } = unlock( routerPrivateApis );

const GLOBAL_SYSTEM_POST_TYPES = [
	'post',
	'page',
	'attachment',
	'nav_menu_item',
	'wp_block',
	'wp_template',
	'wp_template_part',
	'wp_global_styles',
	'wp_navigation',
	'wp_font_family',
	'wp_font_face',
];

const getAddNewPageCommand = () =>
	function useAddNewPageCommand() {
		const isSiteEditor = getPath( window.location.href )?.includes(
			'site-editor.php'
		);
		const history = useHistory();
		const isBlockBasedTheme = useSelect( ( select ) => {
			return select( coreStore ).getCurrentTheme()?.is_block_theme;
		}, [] );
		const { saveEntityRecord } = useDispatch( coreStore );
		const { createErrorNotice } = useDispatch( noticesStore );

		const createPageEntity = useCallback(
			async ( { close } ) => {
				try {
					const page = await saveEntityRecord(
						'postType',
						'page',
						{
							status: 'draft',
						},
						{
							throwOnError: true,
						}
					);
					if ( page?.id ) {
						history.navigate( `/page/${ page.id }?canvas=edit` );
					}
				} catch ( error ) {
					const errorMessage =
						error.message && error.code !== 'unknown_error'
							? error.message
							: __(
									'An error occurred while creating the item.'
							  );

					createErrorNotice( errorMessage, {
						type: 'snackbar',
					} );
				} finally {
					close();
				}
			},
			[ createErrorNotice, history, saveEntityRecord ]
		);

		const commands = useMemo( () => {
			const addNewPage =
				isSiteEditor && isBlockBasedTheme
					? createPageEntity
					: () =>
							( document.location.href =
								'post-new.php?post_type=page' );
			return [
				{
					name: 'core/add-new-page',
					label: __( 'Add new page' ),
					icon: plus,
					callback: addNewPage,
				},
			];
		}, [ createPageEntity, isSiteEditor, isBlockBasedTheme ] );

		return {
			isLoading: false,
			commands,
		};
	};

const getAddNewCustomPostTypeCommands = () =>
	function useAddNewCustomPostTypeCommands() {
		const customPostTypes = useSelect( ( select ) => {
			const { getPostTypes } = select( coreStore );
			const postTypes = getPostTypes( { per_page: -1 } );

			if ( ! postTypes ) {
				return [];
			}

			// Filter to only include user-created custom post types
			// Exclude system post types and core WordPress post types
			const systemPostTypes = GLOBAL_SYSTEM_POST_TYPES;

			return postTypes
				?.filter(
					( { viewable, slug } ) =>
						viewable && ! systemPostTypes.includes( slug )
				)
				.sort( ( a, b ) => a.name.localeCompare( b.name ) );
		}, [] );

		const commands = useMemo( () => {
			return customPostTypes.map( ( postType ) => {
				const { slug, labels, icon } = postType;
				const singularName =
					labels?.singular_name || labels?.name || slug;
				const commandLabel = sprintf(
					// translators: %s: Post type name
					__( 'Add new %s' ),
					singularName
				);

				// Handle icon - convert dashicon strings to proper components
				let iconComponent = plus;
				if ( icon && typeof icon === 'string' ) {
					// If it's a dashicon string (starts with 'dashicons-'), convert to Dashicon component
					if ( icon.startsWith( 'dashicons-' ) ) {
						const dashiconName = icon.replace( 'dashicons-', '' );
						iconComponent = <Dashicon icon={ dashiconName } />;
					} else {
						// For other string icons, use plus as fallback
						iconComponent = plus;
					}
				} else if ( icon && typeof icon === 'function' ) {
					// If it's already a component, use it
					iconComponent = icon;
				}

				return {
					name: `core/add-new-${ slug }`,
					label: commandLabel,
					icon: iconComponent,
					callback: () => {
						document.location.assign(
							`post-new.php?post_type=${ slug }`
						);
					},
				};
			} );
		}, [ customPostTypes ] );

		return {
			isLoading: false,
			commands,
		};
	};

export function useAdminNavigationCommands() {
	useCommand( {
		name: 'core/add-new-post',
		label: __( 'Add new post' ),
		icon: plus,
		callback: () => {
			document.location.assign( 'post-new.php' );
		},
	} );

	useCommandLoader( {
		name: 'core/add-new-page',
		hook: getAddNewPageCommand(),
	} );

	useCommandLoader( {
		name: 'core/add-new-custom-post-types',
		hook: getAddNewCustomPostTypeCommands(),
	} );
}
