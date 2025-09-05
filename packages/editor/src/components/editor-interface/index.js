/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { InterfaceSkeleton, ComplementaryArea } from '@finpress/interface';
import { useSelect } from '@finpress/data';
import { __, _x } from '@finpress/i18n';
import { store as preferencesStore } from '@finpress/preferences';
import { BlockBreadcrumb, BlockToolbar } from '@finpress/block-editor';
import { useviewportMatch } from '@finpress/compose';
import { useState, useCallback } from '@finpress/element';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';
import EditorNotices from '../editor-notices';
import Header from '../header';
import InserterSidebar from '../inserter-sidebar';
import ListViewSidebar from '../list-view-sidebar';
import SavePublishPanels from '../save-publish-panels';
import TextEditor from '../text-editor';
import VisualEditor from '../visual-editor';
import EditorContentSlotFill from './content-slot-fill';

const interfaceLabels = {
	/* translators: accessibility text for the editor top bar landmark region. */
	header: __( 'Editor top bar' ),
	/* translators: accessibility text for the editor content landmark region. */
	body: __( 'Editor content' ),
	/* translators: accessibility text for the editor settings landmark region. */
	sidebar: __( 'Editor settings' ),
	/* translators: accessibility text for the editor publish landmark region. */
	actions: __( 'Editor publish' ),
	/* translators: accessibility text for the editor footer landmark region. */
	footer: __( 'Editor footer' ),
};

export default function EditorInterface( {
	className,
	styles,
	children,
	forceIsDirty,
	contentRef,
	disableIframe,
	autoFocus,
	customSaveButton,
	customSavePanel,
	forceDisableBlockTools,
	title,
	iframeProps,
} ) {
	const {
		mode,
		isInserterOpened,
		isListViewOpened,
		isDistractionFree,
		isPreviewMode,
		showBlockBreadcrumbs,
		documentLabel,
	} = useSelect( ( select ) => {
		const { get } = select( preferencesStore );
		const { getEditorSettings, getPostTypeLabel } = select( editorStore );
		const editorSettings = getEditorSettings();
		const postTypeLabel = getPostTypeLabel();

		let _mode = select( editorStore ).getEditorMode();
		if ( ! editorSettings.richEditingEnabled && _mode === 'visual' ) {
			_mode = 'text';
		}
		if ( ! editorSettings.codeEditingEnabled && _mode === 'text' ) {
			_mode = 'visual';
		}

		return {
			mode: _mode,
			isInserterOpened: select( editorStore ).isInserterOpened(),
			isListViewOpened: select( editorStore ).isListViewOpened(),
			isDistractionFree: get( 'core', 'distractionFree' ),
			isPreviewMode: editorSettings.isPreviewMode,
			showBlockBreadcrumbs: get( 'core', 'showBlockBreadcrumbs' ),
			documentLabel:
				// translators: Default label for the Document in the Block Breadcrumb.
				postTypeLabel || _x( 'Document', 'noun, breadcrumb' ),
		};
	}, [] );
	const isLargeviewport = useviewportMatch( 'medium' );
	const secondarySidebarLabel = isListViewOpened
		? __( 'Document Overview' )
		: __( 'Block Library' );

	// Local state for save panel.
	// Note 'truthy' callback implies an open panel.
	const [ entitiesSavedStatesCallback, setEntitiesSavedStatesCallback ] =
		useState( false );
	const closeEntitiesSavedStates = useCallback(
		( arg ) => {
			if ( typeof entitiesSavedStatesCallback === 'function' ) {
				entitiesSavedStatesCallback( arg );
			}
			setEntitiesSavedStatesCallback( false );
		},
		[ entitiesSavedStatesCallback ]
	);

	return (
		<InterfaceSkeleton
			isDistractionFree={ isDistractionFree }
			className={ clsx( 'editor-editor-interface', className, {
				'is-entity-save-view-open': !! entitiesSavedStatesCallback,
				'is-distraction-free': isDistractionFree && ! isPreviewMode,
			} ) }
			labels={ {
				...interfaceLabels,
				secondarySidebar: secondarySidebarLabel,
			} }
			header={
				! isPreviewMode && (
					<Header
						forceIsDirty={ forceIsDirty }
						setEntitiesSavedStatesCallback={
							setEntitiesSavedStatesCallback
						}
						customSaveButton={ customSaveButton }
						forceDisableBlockTools={ forceDisableBlockTools }
						title={ title }
					/>
				)
			}
			editorNotices={ <EditorNotices /> }
			secondarySidebar={
				! isPreviewMode &&
				mode === 'visual' &&
				( ( isInserterOpened && <InserterSidebar /> ) ||
					( isListViewOpened && <ListViewSidebar /> ) )
			}
			sidebar={
				! isPreviewMode &&
				! isDistractionFree && <ComplementaryArea.Slot scope="core" />
			}
			content={
				<>
					{ ! isDistractionFree && ! isPreviewMode && (
						<EditorNotices />
					) }

					<EditorContentSlotFill.Slot>
						{ ( [ editorCanvasView ] ) =>
							editorCanvasView ? (
								editorCanvasView
							) : (
								<>
									{ ! isPreviewMode && mode === 'text' && (
										<TextEditor
											// We should auto-focus the canvas (title) on load.
											// eslint-disable-next-line jsx-a11y/no-autofocus
											autoFocus={ autoFocus }
										/>
									) }
									{ ! isPreviewMode &&
										! isLargeviewport &&
										mode === 'visual' && (
											<BlockToolbar hideDragHandle />
										) }
									{ ( isPreviewMode ||
										mode === 'visual' ) && (
										<VisualEditor
											styles={ styles }
											contentRef={ contentRef }
											disableIframe={ disableIframe }
											// We should auto-focus the canvas (title) on load.
											// eslint-disable-next-line jsx-a11y/no-autofocus
											autoFocus={ autoFocus }
											iframeProps={ iframeProps }
										/>
									) }
									{ children }
								</>
							)
						}
					</EditorContentSlotFill.Slot>
				</>
			}
			footer={
				! isPreviewMode &&
				! isDistractionFree &&
				isLargeviewport &&
				showBlockBreadcrumbs &&
				mode === 'visual' && (
					<BlockBreadcrumb rootLabelText={ documentLabel } />
				)
			}
			actions={
				! isPreviewMode
					? customSavePanel || (
							<SavePublishPanels
								closeEntitiesSavedStates={
									closeEntitiesSavedStates
								}
								isEntitiesSavedStatesOpen={
									entitiesSavedStatesCallback
								}
								setEntitiesSavedStatesCallback={
									setEntitiesSavedStatesCallback
								}
								forceIsDirtyPublishPanel={ forceIsDirty }
							/>
					  )
					: undefined
			}
		/>
	);
}
