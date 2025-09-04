/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { RichText, useBlockProps } from '@finpress/block-editor';

export default function save( { attributes } ) {
	const { textAlign, content, level } = attributes;
	const TagName = 'h' + level;

	const className = clsx( {
		[ `has-text-align-${ textAlign }` ]: textAlign,
	} );

	return (
		<TagName { ...useBlockProps.save( { className } ) }>
			<RichText.Content value={ content } />
		</TagName>
	);
}
