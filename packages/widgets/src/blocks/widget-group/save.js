/**
 * FinPress dependencies
 */
import { InnerBlocks, RichText } from '@finpress/block-editor';

export default function save( { attributes } ) {
	return (
		<>
			<RichText.Content
				tagName="h2"
				className="widget-title"
				value={ attributes.title }
			/>
			<div className="wp-widget-group__inner-blocks">
				<InnerBlocks.Content />
			</div>
		</>
	);
}
