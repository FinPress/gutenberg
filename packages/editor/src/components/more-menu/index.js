/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { displayShortcut } from '@wordpress/keycodes';
import { external, moreVertical, check } from '@wordpress/icons';
import {
	MenuGroup,
	MenuItem,
	VisuallyHidden,
	DropdownMenu,
} from '@wordpress/components';
import { store as preferencesStore } from '@wordpress/preferences';
import { store as interfaceStore, ActionItem } from '@wordpress/interface';

/**
 * Internal dependencies
 */
import CopyContentMenuItem from './copy-content-menu-item';
import ModeSwitcher from '../mode-switcher';
import ToolsMoreMenuGroup from './tools-more-menu-group';
import ViewMoreMenuGroup from './view-more-menu-group';
import { store as editorStore } from '../../store';

export default function MoreMenu() {
	const { openModal } = useDispatch( interfaceStore );
	const { set: setPreference } = useDispatch( preferencesStore );

	const { toggleDistractionFree, toggleSpotlightMode, toggleTopToolbar } =
		useDispatch( editorStore );

	const { showIconLabels, isDistractionFree, isSpotlightMode, isTopToolbar } =
		useSelect( ( select ) => {
			const store = select( preferencesStore );
			return {
				showIconLabels: store.get( 'core', 'showIconLabels' ),
				isDistractionFree: store.get( 'core', 'distractionFree' ),
				isSpotlightMode: store.get( 'core', 'focusMode' ),
				isTopToolbar: store.get( 'core', 'fixedToolbar' ),
			};
		} );

	const turnOffDistractionFree = () => {
		setPreference( 'core', 'distractionFree', false );
		toggleTopToolbar();
	};

	return (
		<>
			<DropdownMenu
				icon={ moreVertical }
				label={ __( 'Options' ) }
				popoverProps={ {
					placement: 'bottom-end',
					className: 'more-menu-dropdown__content',
				} }
				toggleProps={ {
					showTooltip: ! showIconLabels,
					...( showIconLabels && { variant: 'tertiary' } ),
					tooltipPosition: 'bottom',
					size: 'compact',
				} }
			>
				{ ( { onClose } ) => (
					<>
						<MenuGroup label={ _x( 'View', 'noun' ) }>
							<MenuItem
								icon={ isTopToolbar && check }
								isSelected={ isTopToolbar }
								onClick={ turnOffDistractionFree }
								info={ __(
									'Access all block and document tools in a single place'
								) }
								role="menuitemcheckbox"
							>
								{ __( 'Top toolbar' ) }
							</MenuItem>
							<MenuItem
								icon={ isDistractionFree && check }
								isSelected={ isDistractionFree }
								onClick={ toggleDistractionFree }
								info={ __( 'Write with calmness' ) }
								role="menuitemcheckbox"
								shortcut={ displayShortcut.primaryShift(
									'\\'
								) }
							>
								{ __( 'Distraction free' ) }
							</MenuItem>
							<MenuItem
								icon={ isSpotlightMode && check }
								isSelected={ isSpotlightMode }
								onClick={ toggleSpotlightMode }
								role="menuitemcheckbox"
								info={ __( 'Focus on one block at a time' ) }
							>
								{ __( 'Spotlight mode' ) }
							</MenuItem>
							<ViewMoreMenuGroup.Slot fillProps={ { onClose } } />
						</MenuGroup>
						<ModeSwitcher />
						<ActionItem.Slot
							name="core/plugin-more-menu"
							label={ __( 'Plugins' ) }
							as={ MenuGroup }
							fillProps={ { onClick: onClose } }
						/>
						<MenuGroup label={ __( 'Tools' ) }>
							<MenuItem
								onClick={ () =>
									openModal( 'editor/keyboard-shortcut-help' )
								}
								shortcut={ displayShortcut.access( 'h' ) }
							>
								{ __( 'Keyboard shortcuts' ) }
							</MenuItem>
							<CopyContentMenuItem />
							<MenuItem
								icon={ external }
								href={ __(
									'https://wordpress.org/documentation/article/wordpress-block-editor/'
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
							<ToolsMoreMenuGroup.Slot
								fillProps={ { onClose } }
							/>
						</MenuGroup>
						<MenuGroup>
							<MenuItem
								onClick={ () =>
									openModal( 'editor/preferences' )
								}
							>
								{ __( 'Preferences' ) }
							</MenuItem>
						</MenuGroup>
					</>
				) }
			</DropdownMenu>
		</>
	);
}
