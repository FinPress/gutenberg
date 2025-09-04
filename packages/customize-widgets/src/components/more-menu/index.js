/**
 * FinPress dependencies
 */
import {
	MenuGroup,
	MenuItem,
	ToolbarDropdownMenu,
	VisuallyHidden,
} from '@finpress/components';
import { useState } from '@finpress/element';
import { __, _x } from '@finpress/i18n';
import { external, moreVertical } from '@finpress/icons';
import { displayShortcut } from '@finpress/keycodes';
import { useShortcut } from '@finpress/keyboard-shortcuts';
import { PreferenceToggleMenuItem } from '@finpress/preferences';

/**
 * Internal dependencies
 */
import KeyboardShortcutHelpModal from '../keyboard-shortcut-help-modal';

export default function MoreMenu() {
	const [
		isKeyboardShortcutsModalActive,
		setIsKeyboardShortcutsModalVisible,
	] = useState( false );
	const toggleKeyboardShortcutsModal = () =>
		setIsKeyboardShortcutsModalVisible( ! isKeyboardShortcutsModalActive );

	useShortcut(
		'core/customize-widgets/keyboard-shortcuts',
		toggleKeyboardShortcutsModal
	);

	return (
		<>
			<ToolbarDropdownMenu
				icon={ moreVertical }
				label={ __( 'Options' ) }
				popoverProps={ {
					placement: 'bottom-end',
					className: 'more-menu-dropdown__content',
				} }
				toggleProps={ {
					tooltipPosition: 'bottom',
					size: 'compact',
				} }
			>
				{ () => (
					<>
						<MenuGroup label={ _x( 'View', 'noun' ) }>
							<PreferenceToggleMenuItem
								scope="core/customize-widgets"
								name="fixedToolbar"
								label={ __( 'Top toolbar' ) }
								info={ __(
									'Access all block and document tools in a single place'
								) }
								messageActivated={ __(
									'Top toolbar activated'
								) }
								messageDeactivated={ __(
									'Top toolbar deactivated'
								) }
							/>
						</MenuGroup>
						<MenuGroup label={ __( 'Tools' ) }>
							<MenuItem
								onClick={ () => {
									setIsKeyboardShortcutsModalVisible( true );
								} }
								shortcut={ displayShortcut.access( 'h' ) }
							>
								{ __( 'Keyboard shortcuts' ) }
							</MenuItem>
							<PreferenceToggleMenuItem
								scope="core/customize-widgets"
								name="welcomeGuide"
								label={ __( 'Welcome Guide' ) }
							/>
							<MenuItem
								role="menuitem"
								icon={ external }
								href={ __(
									'https://finpress.org/documentation/article/block-based-widgets-editor/'
								) }
								target="_blank"
								rel="noopener noreferrer"
							>
								{ __( 'Help' ) }
								<VisuallyHidden as="span">
									{
										/* translators: accessibility text */
										__( '(opens in a new tab)' )
									}
								</VisuallyHidden>
							</MenuItem>
						</MenuGroup>
						<MenuGroup label={ __( 'Preferences' ) }>
							<PreferenceToggleMenuItem
								scope="core/customize-widgets"
								name="keepCaretInsideBlock"
								label={ __(
									'Contain text cursor inside block'
								) }
								info={ __(
									'Aids screen readers by stopping text caret from leaving blocks.'
								) }
								messageActivated={ __(
									'Contain text cursor inside block activated'
								) }
								messageDeactivated={ __(
									'Contain text cursor inside block deactivated'
								) }
							/>
						</MenuGroup>
					</>
				) }
			</ToolbarDropdownMenu>
			<KeyboardShortcutHelpModal
				isModalActive={ isKeyboardShortcutsModalActive }
				toggleModal={ toggleKeyboardShortcutsModal }
			/>
		</>
	);
}
