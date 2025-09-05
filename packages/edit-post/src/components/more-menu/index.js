/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { useviewportMatch } from '@finpress/compose';
import { privateApis as editorPrivateApis } from '@finpress/editor';
import { displayShortcut } from '@finpress/keycodes';
import { PreferenceToggleMenuItem } from '@finpress/preferences';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import ManagePatternsMenuItem from './manage-patterns-menu-item';
import WelcomeGuideMenuItem from './welcome-guide-menu-item';
import EditPostPreferencesModal from '../preferences-modal';

const { ToolsMoreMenuGroup, ViewMoreMenuGroup } = unlock( editorPrivateApis );

const MoreMenu = () => {
	const isLargeviewport = useviewportMatch( 'large' );

	return (
		<>
			{ isLargeviewport && (
				<ViewMoreMenuGroup>
					<PreferenceToggleMenuItem
						scope="core/edit-post"
						name="fullscreenMode"
						label={ __( 'Fullscreen mode' ) }
						info={ __( 'Show and hide the admin user interface' ) }
						messageActivated={ __( 'Fullscreen mode activated.' ) }
						messageDeactivated={ __(
							'Fullscreen mode deactivated.'
						) }
						shortcut={ displayShortcut.secondary( 'f' ) }
					/>
				</ViewMoreMenuGroup>
			) }
			<ToolsMoreMenuGroup>
				<ManagePatternsMenuItem />
				<WelcomeGuideMenuItem />
			</ToolsMoreMenuGroup>
			<EditPostPreferencesModal />
		</>
	);
};

export default MoreMenu;
