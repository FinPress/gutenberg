/**
 * FinPress dependencies
 */
import { SlotFillProvider } from '@finpress/components';
import { useviewportMatch } from '@finpress/compose';
import { uploadMedia } from '@finpress/media-utils';
import { useDispatch, useSelect } from '@finpress/data';
import { useEntityBlockEditor, store as coreStore } from '@finpress/core-data';
import { useMemo } from '@finpress/element';
import { privateApis as blockEditorPrivateApis } from '@finpress/block-editor';
import { privateApis as editPatternsPrivateApis } from '@finpress/patterns';
import { store as preferencesStore } from '@finpress/preferences';
import { privateApis as blockLibraryPrivateApis } from '@finpress/block-library';

/**
 * Internal dependencies
 */
import KeyboardShortcuts from '../keyboard-shortcuts';
import { buildWidgetAreasPostId, KIND, POST_TYPE } from '../../store/utils';
import useLastSelectedWidgetArea from '../../hooks/use-last-selected-widget-area';
import { store as editWidgetsStore } from '../../store';
import { ALLOW_REUSABLE_BLOCKS } from '../../constants';
import { unlock } from '../../lock-unlock';

const { ExperimentalBlockEditorProvider } = unlock( blockEditorPrivateApis );
const { PatternsMenuItems } = unlock( editPatternsPrivateApis );
const { BlockKeyboardShortcuts } = unlock( blockLibraryPrivateApis );

const EMPTY_ARRAY = [];

export default function WidgetAreasBlockEditorProvider( {
	blockEditorSettings,
	children,
	...props
} ) {
	const isLargeviewport = useviewportMatch( 'medium' );
	const {
		hasUploadPermissions,
		reusableBlocks,
		isFixedToolbarActive,
		keepCaretInsideBlock,
		pageOnFront,
		pageForPosts,
	} = useSelect( ( select ) => {
		const { canUser, getEntityRecord, getEntityRecords } =
			select( coreStore );
		const siteSettings = canUser( 'read', {
			kind: 'root',
			name: 'site',
		} )
			? getEntityRecord( 'root', 'site' )
			: undefined;
		return {
			hasUploadPermissions:
				canUser( 'create', {
					kind: 'postType',
					name: 'attachment',
				} ) ?? true,
			reusableBlocks: ALLOW_REUSABLE_BLOCKS
				? getEntityRecords( 'postType', 'fin_block' )
				: EMPTY_ARRAY,
			isFixedToolbarActive: !! select( preferencesStore ).get(
				'core/edit-widgets',
				'fixedToolbar'
			),
			keepCaretInsideBlock: !! select( preferencesStore ).get(
				'core/edit-widgets',
				'keepCaretInsideBlock'
			),
			pageOnFront: siteSettings?.page_on_front,
			pageForPosts: siteSettings?.page_for_posts,
		};
	}, [] );
	const { setIsInserterOpened } = useDispatch( editWidgetsStore );

	const settings = useMemo( () => {
		let mediaUploadBlockEditor;
		if ( hasUploadPermissions ) {
			mediaUploadBlockEditor = ( { onError, ...argumentsObject } ) => {
				uploadMedia( {
					finAllowedMimeTypes: blockEditorSettings.allowedMimeTypes,
					onError: ( { message } ) => onError( message ),
					...argumentsObject,
				} );
			};
		}
		return {
			...blockEditorSettings,
			__experimentalReusableBlocks: reusableBlocks,
			hasFixedToolbar: isFixedToolbarActive || ! isLargeviewport,
			keepCaretInsideBlock,
			mediaUpload: mediaUploadBlockEditor,
			templateLock: 'all',
			__experimentalSetIsInserterOpened: setIsInserterOpened,
			pageOnFront,
			pageForPosts,
			editorTool: 'edit',
		};
	}, [
		hasUploadPermissions,
		blockEditorSettings,
		isFixedToolbarActive,
		isLargeviewport,
		keepCaretInsideBlock,
		reusableBlocks,
		setIsInserterOpened,
		pageOnFront,
		pageForPosts,
	] );

	const widgetAreaId = useLastSelectedWidgetArea();

	const [ blocks, onInput, onChange ] = useEntityBlockEditor(
		KIND,
		POST_TYPE,
		{ id: buildWidgetAreasPostId() }
	);

	return (
		<SlotFillProvider>
			<KeyboardShortcuts.Register />
			<BlockKeyboardShortcuts />
			<ExperimentalBlockEditorProvider
				value={ blocks }
				onInput={ onInput }
				onChange={ onChange }
				settings={ settings }
				useSubRegistry={ false }
				{ ...props }
			>
				{ children }
				<PatternsMenuItems rootClientId={ widgetAreaId } />
			</ExperimentalBlockEditorProvider>
		</SlotFillProvider>
	);
}
