/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';
import { privateApis as routerPrivateApis } from '@wordpress/router';
import { addQueryArgs } from '@wordpress/url';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import SidebarNavigationScreen from '../sidebar-navigation-screen';
import { unlock } from '../../lock-unlock';
import { store as editSiteStore } from '../../store';
import SidebarNavigationItem from '../sidebar-navigation-item';
import useGlobalStylesRevisions from '../global-styles/screen-revisions/use-global-styles-revisions';
import SidebarNavigationScreenDetailsFooter from '../sidebar-navigation-screen-details-footer';
import { MainSidebarNavigationContent } from '../sidebar-navigation-screen-main';

const { useLocation, useHistory } = unlock( routerPrivateApis );

export function SidebarNavigationItemGlobalStyles( props ) {
	const { name } = useLocation();
	return (
		<SidebarNavigationItem
			{ ...props }
			aria-current={ name === 'styles' }
		/>
	);
}

export default function SidebarNavigationScreenGlobalStyles() {
	const history = useHistory();
	const { path } = useLocation();
	const {
		revisions,
		isLoading: isLoadingRevisions,
		revisionsCount,
	} = useGlobalStylesRevisions();
	const editorCanvasContainerView = useSelect(
		( select ) =>
			unlock( select( editSiteStore ) ).getEditorCanvasContainerView(),
		[]
	);
	const { setEditorCanvasContainerView } = unlock(
		useDispatch( editSiteStore )
	);
	const openRevisions = useCallback( () => {
		if ( 'style-book' === editorCanvasContainerView ) {
			setEditorCanvasContainerView(
				'global-styles-revisions:style-book'
			);
		}
		history.navigate(
			addQueryArgs( path, {
				section: '/revisions',
			} )
		);
	}, [ path, history, editorCanvasContainerView ] );

	// If there are no revisions, do not render a footer.
	const shouldShowGlobalStylesFooter =
		!! revisionsCount && ! isLoadingRevisions;

	return (
		<>
			<SidebarNavigationScreen
				title={ __( 'Design' ) }
				isRoot
				description={ __(
					'Customize the appearance of your website using the block editor.'
				) }
				content={
					<MainSidebarNavigationContent activeItem="styles-navigation-item" />
				}
				footer={
					shouldShowGlobalStylesFooter && (
						<SidebarNavigationScreenDetailsFooter
							record={ revisions?.[ 0 ] }
							revisionsCount={ revisionsCount }
							onClick={ openRevisions }
						/>
					)
				}
			/>
		</>
	);
}
