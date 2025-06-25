/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { textAlign, content, level } = attributes;
	const TagName = 'h' + level;

	if ( ! content || content.trim().length === 0 ) {
		return null;
	}

	const className = clsx( {
		[ `has-text-align-${ textAlign }` ]: textAlign,
	} );

	return (
		<TagName { ...useBlockProps.save( { className } ) }>
			<RichText.Content value={ content } />
		</TagName>
	);
}
