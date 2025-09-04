/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { InnerBlocks, RichText, useBlockProps } from '@finpress/block-editor';

export default function save( { attributes } ) {
	const { textAlign, citation } = attributes;

	const className = clsx( {
		[ `has-text-align-${ textAlign }` ]: textAlign,
	} );

	return (
		<blockquote { ...useBlockProps.save( { className } ) }>
			<InnerBlocks.Content />
			{ ! RichText.isEmpty( citation ) && (
				<RichText.Content tagName="cite" value={ citation } />
			) }
		</blockquote>
	);
}
