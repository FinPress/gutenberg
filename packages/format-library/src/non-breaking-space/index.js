/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { insert } from '@finpress/rich-text';
import { RichTextShortcut } from '@finpress/block-editor';

const name = 'core/non-breaking-space';
const title = __( 'Non breaking space' );

export const nonBreakingSpace = {
	name,
	title,
	tagName: 'nbsp',
	className: null,
	edit( { value, onChange } ) {
		function addNonBreakingSpace() {
			onChange( insert( value, '\u00a0' ) );
		}

		return (
			<RichTextShortcut
				type="primaryShift"
				character=" "
				onUse={ addNonBreakingSpace }
			/>
		);
	},
};
