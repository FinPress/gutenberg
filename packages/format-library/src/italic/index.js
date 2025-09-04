/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { toggleFormat } from '@finpress/rich-text';
import {
	RichTextToolbarButton,
	RichTextShortcut,
	__unstableRichTextInputEvent,
	privateApis as blockEditorPrivateApis,
} from '@finpress/block-editor';
import { formatItalic } from '@finpress/icons';

/**
 * Internal dependencies
 */
import { unlock } from '../lock-unlock';

const { essentialFormatKey } = unlock( blockEditorPrivateApis );

const name = 'core/italic';
const title = __( 'Italic' );

export const italic = {
	name,
	title,
	tagName: 'em',
	className: null,
	[ essentialFormatKey ]: true,
	edit( { isActive, value, onChange, onFocus } ) {
		function onToggle() {
			onChange( toggleFormat( value, { type: name, title } ) );
		}

		function onClick() {
			onChange( toggleFormat( value, { type: name } ) );
			onFocus();
		}

		return (
			<>
				<RichTextShortcut
					type="primary"
					character="i"
					onUse={ onToggle }
				/>
				<RichTextToolbarButton
					name="italic"
					icon={ formatItalic }
					title={ title }
					onClick={ onClick }
					isActive={ isActive }
					shortcutType="primary"
					shortcutCharacter="i"
				/>
				<__unstableRichTextInputEvent
					inputType="formatItalic"
					onInput={ onToggle }
				/>
			</>
		);
	},
};
