/**
 * WordPress dependencies
 */
import { __experimentalItemGroup as ItemGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { layout, symbol, navigation, styles, page } from '@wordpress/icons';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import SidebarNavigationScreen from '../sidebar-navigation-screen';
import SidebarNavigationItem from '../sidebar-navigation-item';
import { SidebarNavigationItemGlobalStyles } from '../sidebar-navigation-screen-global-styles';
import { unlock } from '../../lock-unlock';
import { store as editSiteStore } from '../../store';

export function MainSidebarNavigationContent( { isBlockBasedTheme = true } ) {
	return (
		<ItemGroup className="edit-site-sidebar-navigation-screen-main">
			{ isBlockBasedTheme && (
				<>
					<SidebarNavigationItem
						uid="navigation-navigation-item"
						to="/navigation"
						withChevron
						icon={ navigation }
						description={ __(
							'Manage your Navigation menus. (Navigation, Footer navigation\u2026)'
						) }
					>
						{ __( 'Navigation' ) }
					</SidebarNavigationItem>
					<SidebarNavigationItemGlobalStyles
						to="/styles"
						uid="global-styles-navigation-item"
						icon={ styles }
						description={ __(
							'Choose a different style combination for the theme styles. (Blue, Green, Orange\u2026)'
						) }
					>
						{ __( 'Styles' ) }
					</SidebarNavigationItemGlobalStyles>
					<SidebarNavigationItem
						uid="page-navigation-item"
						to="/page"
						withChevron
						icon={ page }
						description={ __(
							'Browse and edit pages on your site. (Home page, index, Sample page\u2026)'
						) }
					>
						{ __( 'Pages' ) }
					</SidebarNavigationItem>
					<SidebarNavigationItem
						uid="template-navigation-item"
						to="/template"
						withChevron
						icon={ layout }
						description={ __(
							'Express the layout of your site with templates. (Page, single posts, 404\u2026)'
						) }
					>
						{ __( 'Templates' ) }
					</SidebarNavigationItem>
				</>
			) }
			{ ! isBlockBasedTheme && (
				<SidebarNavigationItem
					uid="stylebook-navigation-item"
					to="/stylebook"
					withChevron
					icon={ styles }
				>
					{ __( 'Styles' ) }
				</SidebarNavigationItem>
			) }
			<SidebarNavigationItem
				uid="patterns-navigation-item"
				to="/pattern"
				withChevron
				icon={ symbol }
				description={ __(
					'Manage what patterns are available when editing the site. (Call to action, headers, footers\u2026)'
				) }
			>
				{ __( 'Patterns' ) }
			</SidebarNavigationItem>
		</ItemGroup>
	);
}

export default function SidebarNavigationScreenMain() {
	const isBlockBasedTheme = useSelect(
		( select ) => select( coreStore ).getCurrentTheme()?.is_block_theme,
		[]
	);
	const { setEditorCanvasContainerView } = unlock(
		useDispatch( editSiteStore )
	);

	// Clear the editor canvas container view when accessing the main navigation screen.
	useEffect( () => {
		setEditorCanvasContainerView( undefined );
	}, [ setEditorCanvasContainerView ] );

	return (
		<SidebarNavigationScreen
			isRoot
			title={ __( 'Design' ) }
			description={
				isBlockBasedTheme
					? __(
							'Customize the appearance of your website using the block editor.'
					  )
					: __(
							'Explore block styles and patterns to refine your site'
					  )
			}
			content={
				<MainSidebarNavigationContent
					isBlockBasedTheme={ isBlockBasedTheme }
				/>
			}
		/>
	);
}
