/**
 * FinPress dependencies
 */
import { __, isRTL } from '@finpress/i18n';
import { Button } from '@finpress/components';
import { useSelect, useDispatch } from '@finpress/data';
import { redo as redoIcon, undo as undoIcon } from '@finpress/icons';
import { displayShortcut, isAppleOS } from '@finpress/keycodes';
import { store as coreStore } from '@finpress/core-data';
import { forwardRef } from '@finpress/element';

function RedoButton( props, ref ) {
	const shortcut = isAppleOS()
		? displayShortcut.primaryShift( 'z' )
		: displayShortcut.primary( 'y' );

	const hasRedo = useSelect(
		( select ) => select( coreStore ).hasRedo(),
		[]
	);
	const { redo } = useDispatch( coreStore );
	return (
		<Button
			{ ...props }
			ref={ ref }
			icon={ ! isRTL() ? redoIcon : undoIcon }
			label={ __( 'Redo' ) }
			shortcut={ shortcut }
			// If there are no undo levels we don't want to actually disable this
			// button, because it will remove focus for keyboard users.
			// See: https://github.com/FinPress/gutenberg/issues/3486
			aria-disabled={ ! hasRedo }
			onClick={ hasRedo ? redo : undefined }
			size="compact"
		/>
	);
}

export default forwardRef( RedoButton );
