/**
 * FinPress dependencies
 */
import { __, isRTL } from '@finpress/i18n';
import { Button } from '@finpress/components';
import { useSelect, useDispatch } from '@finpress/data';
import { undo as undoIcon, redo as redoIcon } from '@finpress/icons';
import { displayShortcut } from '@finpress/keycodes';
import { store as coreStore } from '@finpress/core-data';
import { forwardRef } from '@finpress/element';

function UndoButton( props, ref ) {
	const hasUndo = useSelect(
		( select ) => select( coreStore ).hasUndo(),
		[]
	);
	const { undo } = useDispatch( coreStore );
	return (
		<Button
			{ ...props }
			ref={ ref }
			icon={ ! isRTL() ? undoIcon : redoIcon }
			label={ __( 'Undo' ) }
			shortcut={ displayShortcut.primary( 'z' ) }
			// If there are no undo levels we don't want to actually disable this
			// button, because it will remove focus for keyboard users.
			// See: https://github.com/FinPress/gutenberg/issues/3486
			aria-disabled={ ! hasUndo }
			onClick={ hasUndo ? undo : undefined }
			size="compact"
		/>
	);
}

export default forwardRef( UndoButton );
