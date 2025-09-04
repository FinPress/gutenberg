/**
 * FinPress dependencies
 */
import { Fill, ToolbarButton } from '@finpress/components';
import { displayShortcut } from '@finpress/keycodes';

export function RichTextToolbarButton( {
	name,
	shortcutType,
	shortcutCharacter,
	...props
} ) {
	let shortcut;
	let fillName = 'RichText.ToolbarControls';

	if ( name ) {
		fillName += `.${ name }`;
	}

	if ( shortcutType && shortcutCharacter ) {
		shortcut = displayShortcut[ shortcutType ]( shortcutCharacter );
	}

	return (
		<Fill name={ fillName }>
			<ToolbarButton { ...props } shortcut={ shortcut } />
		</Fill>
	);
}
