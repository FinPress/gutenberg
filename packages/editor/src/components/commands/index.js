/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { __, isRTL } from '@wordpress/i18n';
import {
	blockDefault,
	code,
	drawerLeft,
	drawerRight,
	edit,
	formatListBullets,
	listView,
	external,
	keyboard,
	symbol,
} from '@wordpress/icons';
import { useCommandLoader } from '@wordpress/commands';
import { store as preferencesStore } from '@wordpress/preferences';
import { store as noticesStore } from '@wordpress/notices';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';
import { store as interfaceStore } from '@wordpress/interface';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';
import { PATTERN_POST_TYPE } from '../../store/constants';
import { modalName as patternRenameModalName } from '../pattern-rename-modal';
import { modalName as patternDuplicateModalName } from '../pattern-duplicate-modal';

function useEditorCommandLoader() {
	const {
		editorMode,
		isListViewOpen,
		showBlockBreadcrumbs,
		isDistractionFree,
		isFocusMode,
		isPreviewMode,
		isViewable,
		isCodeEditingEnabled,
		isRichEditingEnabled,
		isPublishSidebarEnabled,
	} = useSelect( ( select ) => {
		const { get } = select( preferencesStore );
		const { isListViewOpened, getCurrentPostType, getEditorSettings } =
			select( editorStore );
		const { getSettings } = select( blockEditorStore );
		const { getPostType } = select( coreStore );

		return {
			editorMode: get( 'core', 'editorMode' ) ?? 'visual',
			isListViewOpen: isListViewOpened(),
			showBlockBreadcrumbs: get( 'core', 'showBlockBreadcrumbs' ),
			isDistractionFree: get( 'core', 'distractionFree' ),
			isFocusMode: get( 'core', 'focusMode' ),
			isPreviewMode: getSettings().isPreviewMode,
			isViewable: getPostType( getCurrentPostType() )?.viewable ?? false,
			isCodeEditingEnabled: getEditorSettings().codeEditingEnabled,
			isRichEditingEnabled: getEditorSettings().richEditingEnabled,
			isPublishSidebarEnabled:
				select( editorStore ).isPublishSidebarEnabled(),
		};
	}, [] );
	const { getActiveComplementaryArea } = useSelect( interfaceStore );
	const { toggle } = useDispatch( preferencesStore );
	const { createInfoNotice } = useDispatch( noticesStore );
	const {
		__unstableSaveForPreview,
		setIsListViewOpened,
		switchEditorMode,
		toggleDistractionFree,
		toggleSpotlightMode,
		toggleTopToolbar,
	} = useDispatch( editorStore );
	const { openModal, enableComplementaryArea, disableComplementaryArea } =
		useDispatch( interfaceStore );
	const { getCurrentPostId } = useSelect( editorStore );
	const allowSwitchEditorMode = isCodeEditingEnabled && isRichEditingEnabled;

	if ( isPreviewMode ) {
		return { commands: [], isLoading: false };
	}

	const commands = [];

	commands.push( {
		name: 'core/open-shortcut-help',
		label: __( 'Keyboard shortcuts' ),
		icon: keyboard,
		callback: ( { close } ) => {
			close();
			openModal( 'editor/keyboard-shortcut-help' );
		},
	} );

	commands.push( {
		name: 'core/toggle-distraction-free',
		label: isDistractionFree
			? __( 'Exit Distraction free' )
			: __( 'Enter Distraction free' ),
		callback: ( { close } ) => {
			toggleDistractionFree();
			close();
		},
	} );

	commands.push( {
		name: 'core/open-preferences',
		label: __( 'Editor preferences' ),
		callback: ( { close } ) => {
			close();
			openModal( 'editor/preferences' );
		},
	} );

	commands.push( {
		name: 'core/toggle-spotlight-mode',
		label: isFocusMode
			? __( 'Exit Spotlight mode' )
			: __( 'Enter Spotlight mode' ),
		callback: ( { close } ) => {
			toggleSpotlightMode();
			close();
		},
	} );

	commands.push( {
		name: 'core/toggle-list-view',
		label: isListViewOpen
			? __( 'Close List View' )
			: __( 'Open List View' ),
		icon: listView,
		callback: ( { close } ) => {
			setIsListViewOpened( ! isListViewOpen );
			close();
			createInfoNotice(
				isListViewOpen ? __( 'List View off.' ) : __( 'List View on.' ),
				{
					id: 'core/editor/toggle-list-view/notice',
					type: 'snackbar',
				}
			);
		},
	} );

	commands.push( {
		name: 'core/toggle-top-toolbar',
		label: __( 'Top toolbar' ),
		callback: ( { close } ) => {
			toggleTopToolbar();
			close();
		},
	} );

	if ( allowSwitchEditorMode ) {
		commands.push( {
			name: 'core/toggle-code-editor',
			label:
				editorMode === 'visual'
					? __( 'Open code editor' )
					: __( 'Exit code editor' ),
			icon: code,
			callback: ( { close } ) => {
				switchEditorMode( editorMode === 'visual' ? 'text' : 'visual' );
				close();
			},
		} );
	}

	commands.push( {
		name: 'core/toggle-breadcrumbs',
		label: showBlockBreadcrumbs
			? __( 'Hide block breadcrumbs' )
			: __( 'Show block breadcrumbs' ),
		callback: ( { close } ) => {
			toggle( 'core', 'showBlockBreadcrumbs' );
			close();
			createInfoNotice(
				showBlockBreadcrumbs
					? __( 'Breadcrumbs hidden.' )
					: __( 'Breadcrumbs visible.' ),
				{
					id: 'core/editor/toggle-breadcrumbs/notice',
					type: 'snackbar',
				}
			);
		},
	} );

	commands.push( {
		name: 'core/open-settings-sidebar',
		label: __( 'Show or hide the Settings panel.' ),
		icon: isRTL() ? drawerLeft : drawerRight,
		callback: ( { close } ) => {
			const activeSidebar = getActiveComplementaryArea( 'core' );
			close();
			if ( activeSidebar === 'edit-post/document' ) {
				disableComplementaryArea( 'core' );
			} else {
				enableComplementaryArea( 'core', 'edit-post/document' );
			}
		},
	} );

	commands.push( {
		name: 'core/open-block-inspector',
		label: __( 'Show or hide the Block settings panel' ),
		icon: blockDefault,
		callback: ( { close } ) => {
			const activeSidebar = getActiveComplementaryArea( 'core' );
			close();
			if ( activeSidebar === 'edit-post/block' ) {
				disableComplementaryArea( 'core' );
			} else {
				enableComplementaryArea( 'core', 'edit-post/block' );
			}
		},
	} );

	commands.push( {
		name: 'core/toggle-publish-sidebar',
		label: isPublishSidebarEnabled
			? __( 'Disable pre-publish checks' )
			: __( 'Enable pre-publish checks' ),
		icon: formatListBullets,
		callback: ( { close } ) => {
			close();
			toggle( 'core', 'isPublishSidebarEnabled' );
			createInfoNotice(
				isPublishSidebarEnabled
					? __( 'Pre-publish checks disabled.' )
					: __( 'Pre-publish checks enabled.' ),
				{
					id: 'core/editor/publish-sidebar/notice',
					type: 'snackbar',
				}
			);
		},
	} );

	if ( isViewable ) {
		commands.push( {
			name: 'core/preview-link',
			label: __( 'Preview in a new tab' ),
			icon: external,
			callback: async ( { close } ) => {
				close();
				const postId = getCurrentPostId();
				const link = await __unstableSaveForPreview();
				window.open( link, `wp-preview-${ postId }` );
			},
		} );
	}

	return {
		commands,
		isLoading: false,
	};
}

function useEditedEntityContextualCommands() {
	const { postType, isViewable, status, link } = useSelect( ( select ) => {
		const {
			getCurrentPostType,
			getEditedPostAttribute,
			getEditedPostPreviewLink,
		} = select( editorStore );
		const { getPostType } = select( coreStore );
		const isPublished = getEditedPostAttribute( 'status' ) === 'publish';
		const _postType = getCurrentPostType();
		return {
			postType: _postType,
			isViewable: getPostType( _postType )?.viewable ?? false,
			status: getEditedPostAttribute( 'status' ),
			link: isPublished
				? getEditedPostAttribute( 'link' )
				: getEditedPostPreviewLink?.() ?? '',
		};
	}, [] );
	const { openModal } = useDispatch( interfaceStore );
	const commands = [];

	if ( postType === PATTERN_POST_TYPE ) {
		commands.push( {
			name: 'core/rename-pattern',
			label: __( 'Rename pattern' ),
			icon: edit,
			callback: ( { close } ) => {
				openModal( patternRenameModalName );
				close();
			},
		} );
		commands.push( {
			name: 'core/duplicate-pattern',
			label: __( 'Duplicate pattern' ),
			icon: symbol,
			callback: ( { close } ) => {
				openModal( patternDuplicateModalName );
				close();
			},
		} );
	}
	if ( isViewable ) {
		if ( postType === 'post' || postType === 'page' ) {
			const isPage = postType === 'page';
			let label;

			if ( status === 'publish' ) {
				label = isPage ? __( 'View page' ) : __( 'View post' );
			} else {
				label = isPage ? __( 'Preview page' ) : __( 'Preview post' );
			}

			commands.push( {
				name: 'core/view-link',
				label,
				icon: external,
				callback: ( { close } ) => {
					close();
					if ( link ) {
						window.open( link, '_blank' );
					}
				},
			} );
		}
	}

	return { isLoading: false, commands };
}

export default function useCommands() {
	useCommandLoader( {
		name: 'core/editor/edit-ui',
		hook: useEditorCommandLoader,
	} );

	useCommandLoader( {
		name: 'core/editor/contextual-commands',
		hook: useEditedEntityContextualCommands,
		context: 'entity-edit',
	} );
}
