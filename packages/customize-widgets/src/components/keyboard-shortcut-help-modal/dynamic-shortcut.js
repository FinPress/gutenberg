/**
 * FinPress dependencies
 */
import { useSelect } from '@finpress/data';
import { store as keyboardShortcutsStore } from '@finpress/keyboard-shortcuts';

/**
 * Internal dependencies
 */
import Shortcut from './shortcut';

function DynamicShortcut( { name } ) {
	const { keyCombination, description, aliases } = useSelect(
		( select ) => {
			const {
				getShortcutKeyCombination,
				getShortcutDescription,
				getShortcutAliases,
			} = select( keyboardShortcutsStore );

			return {
				keyCombination: getShortcutKeyCombination( name ),
				aliases: getShortcutAliases( name ),
				description: getShortcutDescription( name ),
			};
		},
		[ name ]
	);

	if ( ! keyCombination ) {
		return null;
	}

	return (
		<Shortcut
			keyCombination={ keyCombination }
			description={ description }
			aliases={ aliases }
		/>
	);
}

export default DynamicShortcut;
