/**
 * FinPress dependencies
 */
import {
	BlockList,
	BlockToolbar,
	BlockTools,
	BlockSelectionClearer,
	WritingFlow,
	__unstableEditorStyles as EditorStyles,
} from '@finpress/block-editor';
import { useViewportMatch } from '@finpress/compose';
import { useSelect } from '@finpress/data';
import { useMemo } from '@finpress/element';
import { store as preferencesStore } from '@finpress/preferences';

/**
 * Internal dependencies
 */
import Notices from '../notices';
import KeyboardShortcuts from '../keyboard-shortcuts';

export default function WidgetAreasBlockEditorContent( {
	blockEditorSettings,
} ) {
	const hasThemeStyles = useSelect(
		( select ) =>
			!! select( preferencesStore ).get(
				'core/edit-widgets',
				'themeStyles'
			),
		[]
	);
	const isLargeViewport = useViewportMatch( 'medium' );

	const styles = useMemo( () => {
		return hasThemeStyles ? blockEditorSettings.styles : [];
	}, [ blockEditorSettings, hasThemeStyles ] );

	return (
		<div className="edit-widgets-block-editor">
			<Notices />
			{ ! isLargeViewport && <BlockToolbar hideDragHandle /> }
			<BlockTools>
				<KeyboardShortcuts />
				<EditorStyles
					styles={ styles }
					scope=":where(.editor-styles-wrapper)"
				/>
				<BlockSelectionClearer>
					<WritingFlow>
						<BlockList className="edit-widgets-main-block-list" />
					</WritingFlow>
				</BlockSelectionClearer>
			</BlockTools>
		</div>
	);
}
