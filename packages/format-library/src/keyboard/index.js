/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { toggleFormat } from '@finpress/rich-text';
import { RichTextToolbarButton } from '@finpress/block-editor';
import { button } from '@finpress/icons';

const name = 'core/keyboard';
const title = __( 'Keyboard input' );

export const keyboard = {
	name,
	title,
	tagName: 'kbd',
	className: null,
	edit( { isActive, value, onChange, onFocus } ) {
		function onToggle() {
			onChange( toggleFormat( value, { type: name, title } ) );
		}

		function onClick() {
			onToggle();
			onFocus();
		}

		return (
			<RichTextToolbarButton
				icon={ button }
				title={ title }
				onClick={ onClick }
				isActive={ isActive }
				role="menuitemcheckbox"
			/>
		);
	},
};
