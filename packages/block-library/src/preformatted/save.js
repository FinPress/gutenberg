/**
 * FinPress dependencies
 */
import { RichText, useBlockProps } from '@finpress/block-editor';

export default function save( { attributes } ) {
	const { content } = attributes;

	return (
		<pre { ...useBlockProps.save() }>
			<RichText.Content value={ content } />
		</pre>
	);
}
