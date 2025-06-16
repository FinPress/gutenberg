/**
 * Internal dependencies
 */
import type { RequestUtils } from './index';
import type { RestOptions } from './rest';

export interface MenuData {
	title: string;
	content: string;
}
export interface NavigationMenu {
	id: number;
	content: string;
	status: 'publish' | 'future' | 'draft' | 'pending' | 'private';
}

/**
 * Create a classic menu
 *
 * @param name        Menu name.
 * @param restOptions Optional REST options to override default settings.
 * @return Menu content.
 */
export async function createClassicMenu(
	this: RequestUtils,
	name: string,
	restOptions?: Partial< RestOptions >
) {
	const menuItems = [
		{
			title: 'Custom link',
			url: 'http://localhost:8889/',
			type: 'custom',
			menu_order: 1,
		},
	];

	const menu = await this.rest< NavigationMenu >( {
		...restOptions,
		method: 'POST',
		path: `/wp/v2/menus/`,
		data: {
			name,
		},
	} );

	await this.batchRest(
		menuItems.map( ( menuItem ) => ( {
			method: 'POST',
			path: `/wp/v2/menu-items`,
			body: {
				menus: menu.id,
				object_id: undefined,
				...menuItem,
				parent: undefined,
			},
		} ) ),
		restOptions
	);

	return menu;
}

/**
 * Create a navigation menu
 *
 * @param menuData    navigation menu post data.
 * @param restOptions Optional REST options to override default settings.
 * @return Menu content.
 */
export async function createNavigationMenu(
	this: RequestUtils,
	menuData: MenuData,
	restOptions?: Partial< RestOptions >
) {
	return this.rest( {
		...restOptions,
		method: 'POST',
		path: `/wp/v2/navigation/`,
		data: {
			status: 'publish',
			...menuData,
		},
	} );
}

/**
 * Delete all navigation and classic menus
 *
 * @param restOptions Optional REST options to override default settings.
 */
export async function deleteAllMenus(
	this: RequestUtils,
	restOptions?: Partial< RestOptions >
) {
	const navMenus = await this.rest< NavigationMenu[] >( {
		...restOptions,
		path: `/wp/v2/navigation/`,
		data: {
			status: [
				'publish',
				'pending',
				'draft',
				'auto-draft',
				'future',
				'private',
				'inherit',
				'trash',
			],
		},
	} );

	if ( navMenus.length ) {
		await this.batchRest(
			navMenus.map( ( menu ) => ( {
				method: 'DELETE',
				path: `/wp/v2/navigation/${ menu.id }?force=true`,
			} ) ),
			restOptions
		);
	}

	const classicMenus = await this.rest< NavigationMenu[] >( {
		...restOptions,
		path: `/wp/v2/menus/`,
		data: {
			status: [
				'publish',
				'pending',
				'draft',
				'auto-draft',
				'future',
				'private',
				'inherit',
				'trash',
			],
		},
	} );

	if ( classicMenus.length ) {
		await this.batchRest(
			classicMenus.map( ( menu ) => ( {
				method: 'DELETE',
				path: `/wp/v2/menus/${ menu.id }?force=true`,
			} ) ),
			restOptions
		);
	}
}

/**
 * Get latest navigation menus
 *
 * @param  args
 * @param  args.status
 * @param  restOptions Optional REST options to override default settings.
 * @return {string} Menu content.
 */
export async function getNavigationMenus(
	this: RequestUtils,
	args: { status: 'publish' },
	restOptions?: Partial< RestOptions >
) {
	const navigationMenus = await this.rest< NavigationMenu[] >( {
		...restOptions,
		method: 'GET',
		path: `/wp/v2/navigation/`,
		data: args,
	} );
	return navigationMenus;
}
