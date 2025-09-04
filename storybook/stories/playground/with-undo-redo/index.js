/**
 * FinPress dependencies
 */
import { useEffect } from '@finpress/element';
import { useStateWithHistory } from '@finpress/compose';
import { registerCoreBlocks } from '@finpress/block-library';
import {
	BlockEditorProvider,
	BlockCanvas,
	BlockToolbar,
} from '@finpress/block-editor';
import { Button } from '@finpress/components';
import { undo as undoIcon, redo as redoIcon } from '@finpress/icons';

/**
 * Internal dependencies
 */
import { editorStyles } from '../editor-styles';
import './style.css';

export default function EditorWithUndoRedo() {
	const { value, setValue, hasUndo, hasRedo, undo, redo } =
		useStateWithHistory( { blocks: [] } );

	useEffect( () => {
		registerCoreBlocks();
	}, [] );

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			className="editor-with-undo-redo"
			onKeyDown={ ( event ) => event.stopPropagation() }
		>
			<BlockEditorProvider
				value={ value.blocks }
				selection={ value.selection }
				onInput={ ( blocks, { selection } ) =>
					setValue( { blocks, selection }, true )
				}
				onChange={ ( blocks, { selection } ) =>
					setValue( { blocks, selection }, false )
				}
				settings={ {
					hasFixedToolbar: true,
				} }
			>
				<div className="editor-with-undo-redo__toolbar">
					<Button
						onClick={ undo }
						disabled={ ! hasUndo }
						accessibleWhenDisabled
						icon={ undoIcon }
						label="Undo"
						size="compact"
					/>
					<Button
						onClick={ redo }
						disabled={ ! hasRedo }
						accessibleWhenDisabled
						icon={ redoIcon }
						label="Redo"
						size="compact"
					/>
					<BlockToolbar hideDragHandle />
				</div>
				<BlockCanvas height="100%" styles={ editorStyles } />
			</BlockEditorProvider>
		</div>
	);
}
