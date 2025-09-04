/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { RichText, useBlockProps } from '@finpress/block-editor';

export default function save( { attributes } ) {
	const { textAlign, content } = attributes;

	const className = clsx( {
		[ `has-text-align-${ textAlign }` ]: textAlign,
	} );

	return (
		<pre { ...useBlockProps.save( { className } ) }>
			<RichText.Content value={ content } />
		</pre>
	);
}
