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
import { formatBold } from '@finpress/icons';

/**
 * Internal dependencies
 */
import { unlock } from '../lock-unlock';

const { essentialFormatKey } = unlock( blockEditorPrivateApis );

const name = 'core/bold';
const title = __( 'Bold' );

export const bold = {
	name,
	title,
	tagName: 'strong',
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
					character="b"
					onUse={ onToggle }
				/>
				<RichTextToolbarButton
					name="bold"
					icon={ formatBold }
					title={ title }
					onClick={ onClick }
					isActive={ isActive }
					shortcutType="primary"
					shortcutCharacter="b"
				/>
				<__unstableRichTextInputEvent
					inputType="formatBold"
					onInput={ onToggle }
				/>
			</>
		);
	},
};
