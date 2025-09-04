/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { toggleFormat } from '@finpress/rich-text';
import { RichTextToolbarButton } from '@finpress/block-editor';
import { superscript as superscriptIcon } from '@finpress/icons';

const name = 'core/superscript';
const title = __( 'Superscript' );

export const superscript = {
	name,
	title,
	tagName: 'sup',
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
				icon={ superscriptIcon }
				title={ title }
				onClick={ onClick }
				isActive={ isActive }
				role="menuitemcheckbox"
			/>
		);
	},
};
