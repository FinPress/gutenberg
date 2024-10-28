/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useViewportMatch } from '@wordpress/compose';
import { privateApis as editorPrivateApis } from '@wordpress/editor';
import { displayShortcut } from '@wordpress/keycodes';
import { store as preferencesStore } from '@wordpress/preferences';
import { useDispatch, useSelect } from '@wordpress/data';
import { MenuItem } from '@wordpress/components';
import { check } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import ManagePatternsMenuItem from './manage-patterns-menu-item';
import WelcomeGuideMenuItem from './welcome-guide-menu-item';
import EditPostPreferencesModal from '../preferences-modal';
import { store as editPostStore } from '../../store';

const { ToolsMoreMenuGroup, ViewMoreMenuGroup } = unlock( editorPrivateApis );

const MoreMenu = () => {
	const isLargeViewport = useViewportMatch( 'large' );
	const { toggleFullscreenMode } = useDispatch( editPostStore );
	const isFullscreenMode = useSelect(
		( select ) =>
			select( preferencesStore ).get(
				'core/edit-post',
				'fullscreenMode'
			),
		[]
	);

	return (
		<>
			{ isLargeViewport && (
				<ViewMoreMenuGroup>
					<MenuItem
						icon={ isFullscreenMode && check }
						isSelected={ isFullscreenMode }
						onClick={ toggleFullscreenMode }
						role="menuitemcheckbox"
						info={ __( 'Show and hide the admin user interface' ) }
						shortcut={ displayShortcut.secondary( 'f' ) }
					>
						{ __( 'Fullscreen mode' ) }
					</MenuItem>
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
