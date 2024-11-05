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
	gallery,
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

	commands.push( {
		name: 'core/open-media-library',
		label: __( 'Open Media Library' ),
		icon: gallery,
		callback: ( { close } ) => {
			close();

			const frame = wp.media( {
				title: __( 'Select or Upload Media' ),
				button: {
					text: __( 'Select' ),
				},
				multiple: false,
			} );

			// Handle the selected media
			frame.on( 'select', () => {
				const attachment = frame
					.state()
					.get( 'selection' )
					.first()
					.toJSON();

				// If you want to insert into the block editor, use the blockEditorStore
				const { insertBlocks } =
					wp.data.dispatch( 'core/block-editor' );
				const { createBlock } = wp.blocks;

				// Create an image block with the selected media URL
				const imageBlock = createBlock( 'core/image', {
					url: attachment.url,
					alt: attachment.alt,
				} );

				// Get the selected block client ID
				const selectedBlockClientId = wp.data
					.select( 'core/block-editor' )
					.getSelectedBlockClientId();

				// Get the parent block client ID
				const parentBlockClientId = wp.data
					.select( 'core/block-editor' )
					.getBlockRootClientId( selectedBlockClientId );

				// Get the order of blocks within the parent block
				const blockOrder = wp.data
					.select( 'core/block-editor' )
					.getBlockOrder( parentBlockClientId );

				// Find the index of the selected block within the parent block
				const blockIndex = blockOrder.indexOf( selectedBlockClientId );

				if ( selectedBlockClientId !== null && blockIndex !== -1 ) {
					// Insert the image block after the selected block within the parent block
					insertBlocks(
						imageBlock,
						blockIndex + 1,
						parentBlockClientId
					);
				} else {
					// If no block is selected, insert the image block at the end
					insertBlocks( imageBlock );
				}
			} );

			// Open the frame
			frame.open();
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
	const { postType } = useSelect( ( select ) => {
		const { getCurrentPostType } = select( editorStore );
		return {
			postType: getCurrentPostType(),
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
