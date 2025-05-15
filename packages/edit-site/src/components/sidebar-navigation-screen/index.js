/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	__experimentalHStack as HStack,
	__experimentalHeading as Heading,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { isRTL, __, sprintf } from '@wordpress/i18n';
import { chevronRight, chevronLeft } from '@wordpress/icons';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { privateApis as routerPrivateApis } from '@wordpress/router';
import { useContext, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { store as editSiteStore } from '../../store';
import { unlock } from '../../lock-unlock';
import SidebarButton from '../sidebar-button';
import {
	isPreviewingTheme,
	currentlyPreviewingTheme,
} from '../../utils/is-previewing-theme';
import { SidebarNavigationContext } from '../sidebar';

const { useHistory, useLocation } = unlock( routerPrivateApis );

export default function SidebarNavigationScreen( {
	isRoot,
	title,
	actions,
	content,
	footer,
	description,
	backPath: backPathProp,
} ) {
	const { dashboardLink, dashboardLinkText, previewingThemeName } = useSelect(
		( select ) => {
			const { getSettings } = unlock( select( editSiteStore ) );
			const currentlyPreviewingThemeId = currentlyPreviewingTheme();
			return {
				dashboardLink: getSettings().__experimentalDashboardLink,
				dashboardLinkText:
					getSettings().__experimentalDashboardLinkText,
				// Do not call `getTheme` with null, it will cause a request to
				// the server.
				previewingThemeName: currentlyPreviewingThemeId
					? select( coreStore ).getTheme( currentlyPreviewingThemeId )
							?.name?.rendered
					: undefined,
			};
		},
		[]
	);
	const location = useLocation();
	const history = useHistory();
	const { navigate } = useContext( SidebarNavigationContext );
	const backPath = backPathProp ?? location.state?.backPath;
	const icon = isRTL() ? chevronRight : chevronLeft;

	// Compute the back label from the back path.
	const backLabel = useMemo( () => {
		if ( ! backPath ) {
			return;
		}

		const segments = backPath.split( '/' ).filter( Boolean );
		const lastSegment = segments.pop();

		// Default back label to "design" if no segments are found.
		return lastSegment?.trim() || __( 'design' );
	}, [ backPath ] );

	return (
		<>
			<VStack
				className={ clsx( 'edit-site-sidebar-navigation-screen__main', {
					'has-footer': !! footer,
				} ) }
				spacing={ 0 }
				justify="flex-start"
			>
				<HStack
					spacing={ 3 }
					alignment="flex-start"
					className="edit-site-sidebar-navigation-screen__title-icon"
				>
					{ ! isRoot && (
						<SidebarButton
							onClick={ () => {
								history.navigate( backPath );
								navigate( 'back' );
							} }
							icon={ icon }
							label={
								backLabel
									? sprintf(
											/* translators: %s: back path label */
											__( 'Back to %s' ),
											backLabel
									  )
									: __( 'Back' )
							}
							showTooltip={ false }
						/>
					) }
					{ isRoot && (
						<SidebarButton
							icon={ icon }
							label={
								dashboardLinkText || __( 'Go to the Dashboard' )
							}
							href={ dashboardLink }
						/>
					) }
					<Heading
						className="edit-site-sidebar-navigation-screen__title"
						color={ '#e0e0e0' /* $gray-200 */ }
						level={ 1 }
						size={ 20 }
					>
						{ ! isPreviewingTheme()
							? title
							: sprintf(
									/* translators: 1: theme name. 2: title */
									__( 'Previewing %1$s: %2$s' ),
									previewingThemeName,
									title
							  ) }
					</Heading>
					{ actions && (
						<div className="edit-site-sidebar-navigation-screen__actions">
							{ actions }
						</div>
					) }
				</HStack>
				<div className="edit-site-sidebar-navigation-screen__content">
					{ description && (
						<div className="edit-site-sidebar-navigation-screen__description">
							{ description }
						</div>
					) }
					{ content }
				</div>
			</VStack>
			{ footer && (
				<footer className="edit-site-sidebar-navigation-screen__footer">
					{ footer }
				</footer>
			) }
		</>
	);
}
