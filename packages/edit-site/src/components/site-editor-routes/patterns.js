/**
 * Internal dependencies
 */
import SidebarNavigationScreenPatterns from '../sidebar-navigation-screen-patterns';
import PagePatterns from '../page-patterns';
import { isClassicThemeWithStyleBookSupport } from './utils';

export const patternsRoute = {
	name: 'patterns',
	path: '/pattern',
	areas: {
		sidebar( { siteData } ) {
			const isBlockTheme = siteData.currentTheme?.is_block_theme;
			const backPath =
				isBlockTheme || isClassicThemeWithStyleBookSupport( siteData )
					? '/'
					: undefined;
			const isRoot = ! (
				isBlockTheme || isClassicThemeWithStyleBookSupport( siteData )
			);

			return (
				<SidebarNavigationScreenPatterns
					backPath={ backPath }
					isRoot={ isRoot }
				/>
			);
		},
		content: <PagePatterns />,
		mobile( { siteData, query } ) {
			const { categoryId } = query;
			const isBlockTheme = siteData.currentTheme?.is_block_theme;
			const backPath =
				isBlockTheme || isClassicThemeWithStyleBookSupport( siteData )
					? '/'
					: undefined;
			const isRoot = ! (
				isBlockTheme || isClassicThemeWithStyleBookSupport( siteData )
			);

			return !! categoryId ? (
				<PagePatterns />
			) : (
				<SidebarNavigationScreenPatterns
					backPath={ backPath }
					isRoot={ isRoot }
				/>
			);
		},
	},
};
