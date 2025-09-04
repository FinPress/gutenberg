/**
 * FinPress dependencies
 */
import { __, sprintf } from '@finpress/i18n';
import { MenuItem } from '@finpress/components';
import { createInterpolateElement } from '@finpress/element';
import { plus } from '@finpress/icons';

export const LinkControlSearchCreate = ( {
	searchTerm,
	onClick,
	itemProps,
	buttonText,
} ) => {
	if ( ! searchTerm ) {
		return null;
	}

	let text;
	if ( buttonText ) {
		text =
			typeof buttonText === 'function'
				? buttonText( searchTerm )
				: buttonText;
	} else {
		text = createInterpolateElement(
			sprintf(
				/* translators: %s: search term. */
				__( 'Create: <mark>%s</mark>' ),
				searchTerm
			),
			{ mark: <mark /> }
		);
	}

	return (
		<MenuItem
			{ ...itemProps }
			iconPosition="left"
			icon={ plus }
			className="block-editor-link-control__search-item"
			onClick={ onClick }
		>
			{ text }
		</MenuItem>
	);
};

export default LinkControlSearchCreate;
