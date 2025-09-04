/**
 * FinPress dependencies
 */
import { InnerBlocks, useBlockProps } from '@finpress/block-editor';

const deprecated = [
	// Version with wrapper `div` element.
	{
		save() {
			return (
				<div { ...useBlockProps.save() }>
					<InnerBlocks.Content />
				</div>
			);
		},
	},
];

export default deprecated;
