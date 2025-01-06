/**
 * WordPress dependencies
 */
import {
	store as coreStore,
	useResourcePermissions,
	useEntityRecords,
} from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { PRELOADED_NAVIGATION_MENUS_QUERY } from './constants';

/**
 * Retrieves comprehensive information about a navigation menu and related permissions.
 *
 * This hook provides a centralized way to access navigation menu data, user permissions,
 * and related states. It's particularly useful for components that need to render or
 * manage navigation menus in the WordPress block editor or related interfaces.
 *
 * @param {number|undefined} ref The post ID of the navigation menu. If undefined, some
 *                               return values will be affected (see return object for details).
 *
 * @return {Object} An object containing navigation menu data and related states:
 *   - navigationMenu: The navigation menu post object if it exists and is published or draft, null otherwise.
 *   - isNavigationMenuResolved: Whether the navigation menu data has finished loading.
 *   - isNavigationMenuMissing: Whether the specified navigation menu doesn't exist or isn't accessible.
 *   - navigationMenus: An array of all available navigation menu objects.
 *   - isResolvingNavigationMenus: Whether the list of navigation menus is still loading.
 *   - hasResolvedNavigationMenus: Whether the list of navigation menus has finished loading.
 *   - canSwitchNavigationMenu: Whether there are multiple menus available to switch between.
 *   - canUserCreateNavigationMenus: Whether the current user has permission to create new navigation menus.
 *   - isResolvingCanUserCreateNavigationMenus: Whether the create permission is still being checked.
 *   - hasResolvedCanUserCreateNavigationMenus: Whether the create permission check has completed.
 *   - canUserUpdateNavigationMenu: Whether the user can update the specified menu. Undefined if no ref provided.
 *   - hasResolvedCanUserUpdateNavigationMenu: Whether the update permission check has completed. Undefined if no ref provided.
 *   - canUserDeleteNavigationMenu: Whether the user can delete the specified menu. Undefined if no ref provided.
 *   - hasResolvedCanUserDeleteNavigationMenu: Whether the delete permission check has completed. Undefined if no ref provided.
 */
export default function useNavigationMenu( ref ) {
	// Retrieve permissions related to CRUD operations for Navigation Menus.
	const permissions = useResourcePermissions( {
		kind: 'postType',
		name: 'wp_navigation',
		id: ref, // Necessary to retrieve update and delete permissions. Defaults to true if not provided.
	} );

	const {
		navigationMenu,
		isNavigationMenuResolved,
		isNavigationMenuMissing,
	} = useSelect(
		( select ) => {
			return selectExistingMenu( select, ref );
		},
		[ ref ]
	);

	const {
		canCreate: canCreateNavigationMenus,
		canUpdate: canUpdateNavigationMenu, // undefined if ref is missing.
		canDelete: canDeleteNavigationMenu, // undefined if ref is missing.
		isResolving: isResolvingPermissions,
		hasResolved: hasResolvedPermissions,
	} = permissions;

	const {
		records: navigationMenus,
		isResolving: isResolvingNavigationMenus,
		hasResolved: hasResolvedNavigationMenus,
	} = useEntityRecords(
		'postType',
		`wp_navigation`,
		PRELOADED_NAVIGATION_MENUS_QUERY
	);

	const canSwitchNavigationMenu = ref
		? navigationMenus?.length > 1
		: navigationMenus?.length > 0;

	return {
		navigationMenu,
		isNavigationMenuResolved,
		isNavigationMenuMissing,
		navigationMenus,
		isResolvingNavigationMenus,
		hasResolvedNavigationMenus,
		canSwitchNavigationMenu,
		canUserCreateNavigationMenus: canCreateNavigationMenus,
		isResolvingCanUserCreateNavigationMenus: isResolvingPermissions,
		hasResolvedCanUserCreateNavigationMenus: hasResolvedPermissions,
		canUserUpdateNavigationMenu: canUpdateNavigationMenu,
		hasResolvedCanUserUpdateNavigationMenu: ref
			? hasResolvedPermissions
			: undefined,
		canUserDeleteNavigationMenu: canDeleteNavigationMenu,
		hasResolvedCanUserDeleteNavigationMenu: ref
			? hasResolvedPermissions
			: undefined,
	};
}

/**
 * Selects and retrieves information about an existing navigation menu.
 *
 * This function uses the WordPress data layer to fetch information about a specific
 * navigation menu. It handles both published and draft navigation menus, which is
 * particularly useful in the context of the block editor where draft posts are valid.
 *
 * @param {Function}         select The `select` function from the WordPress data store.
 * @param {number|undefined} ref    The ID of the navigation menu to select.
 *
 * @return {Object} An object containing information about the navigation menu:
 *   - isNavigationMenuResolved: Whether the data for the navigation menu has finished loading.
 *   - isNavigationMenuMissing: Whether the requested navigation menu doesn't exist or isn't accessible.
 *   - navigationMenu: The navigation menu object if it exists and is published or draft, null otherwise.
 */
function selectExistingMenu( select, ref ) {
	if ( ! ref ) {
		return {
			isNavigationMenuResolved: false,
			isNavigationMenuMissing: true,
		};
	}

	const { getEntityRecord, getEditedEntityRecord, hasFinishedResolution } =
		select( coreStore );

	const args = [ 'postType', 'wp_navigation', ref ];
	const navigationMenu = getEntityRecord( ...args );
	const editedNavigationMenu = getEditedEntityRecord( ...args );
	const hasResolvedNavigationMenu = hasFinishedResolution(
		'getEditedEntityRecord',
		args
	);

	// Only published and draft Navigation posts are considered valid.
	// Draft Navigation posts are valid only in the editor context,
	// requiring a post update to publish to show in the frontend.
	const isNavigationMenuPublishedOrDraft =
		editedNavigationMenu.status === 'publish' ||
		editedNavigationMenu.status === 'draft';

	return {
		isNavigationMenuResolved: hasResolvedNavigationMenu,
		isNavigationMenuMissing:
			hasResolvedNavigationMenu &&
			( ! navigationMenu || ! isNavigationMenuPublishedOrDraft ),
		navigationMenu: isNavigationMenuPublishedOrDraft
			? editedNavigationMenu
			: null,
	};
}
