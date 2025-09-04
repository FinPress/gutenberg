/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { RichText, useBlockProps } from '@finpress/block-editor';

export default function save( { attributes } ) {
	const { textAlign, citation, value } = attributes;
	const shouldShowCitation = ! RichText.isEmpty( citation );

	return (
		<figure
			{ ...useBlockProps.save( {
				className: clsx( {
					[ `has-text-align-${ textAlign }` ]: textAlign,
				} ),
			} ) }
		>
			<blockquote>
				<RichText.Content tagName="p" value={ value } />
				{ shouldShowCitation && (
					<RichText.Content tagName="cite" value={ citation } />
				) }
			</blockquote>
		</figure>
	);
}
