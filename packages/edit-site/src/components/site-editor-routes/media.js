/**
 * WordPress dependencies
 */
import { privateApis as routerPrivateApis } from '@wordpress/router';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import SidebarNavigationScreen from '../sidebar-navigation-screen';
import DataViewsSidebarContent from '../sidebar-dataviews';
import SidebarNavigationScreenUnsupported from '../sidebar-navigation-screen-unsupported';
import PostList from '../post-list';
import Editor from '../editor';
import { PostEdit } from '../post-edit';

const { useLocation } = unlock( routerPrivateApis );

function MobilePagesView() {
	const { query = {} } = useLocation();
	const { canvas = 'view' } = query;

	return canvas === 'edit' ? <Editor /> : <PostList postType="attachment" />;
}

export const mediaRoute = {
	name: 'media',
	path: '/media',
	areas: {
		sidebar( { siteData } ) {
			const isBlockTheme = siteData.currentTheme?.is_block_theme;
			return isBlockTheme ? (
				<SidebarNavigationScreen
					title={ __( 'Media' ) }
					backPath="/"
					content={
						<DataViewsSidebarContent postType="attachment" />
					}
				/>
			) : (
				<SidebarNavigationScreenUnsupported />
			);
		},
		content( { siteData } ) {
			const isBlockTheme = siteData.currentTheme?.is_block_theme;
			return isBlockTheme ? (
				<PostList postType="attachment" />
			) : undefined;
		},
		preview( { query, siteData } ) {
			const isBlockTheme = siteData.currentTheme?.is_block_theme;
			if ( ! isBlockTheme ) {
				return undefined;
			}
			const isListView =
				( query.layout === 'list' || ! query.layout ) &&
				query.isCustom !== 'true';
			return isListView ? <Editor /> : undefined;
		},
		mobile( { siteData } ) {
			const isBlockTheme = siteData.currentTheme?.is_block_theme;
			return isBlockTheme ? (
				<MobilePagesView />
			) : (
				<SidebarNavigationScreenUnsupported />
			);
		},
		edit( { query } ) {
			const hasQuickEdit =
				( query.layout ?? 'list' ) !== 'list' && !! query.quickEdit;
			return hasQuickEdit ? (
				<PostEdit postType="attachment" postId={ query.postId } />
			) : undefined;
		},
	},
	widths: {
		content( { query } ) {
			const isListView =
				( query.layout === 'list' || ! query.layout ) &&
				query.isCustom !== 'true';
			return isListView ? 380 : undefined;
		},
		edit( { query } ) {
			const hasQuickEdit =
				( query.layout ?? 'list' ) !== 'list' && !! query.quickEdit;
			return hasQuickEdit ? 380 : undefined;
		},
	},
};
