/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { useBlockProps, useInnerBlocksProps } from '@finpress/block-editor';

const TEMPLATE = [
	[
		'core/buttons',
		{},
		[
			[
				'core/button',
				{
					text: __( 'Submit' ),
					tagName: 'button',
					type: 'submit',
				},
			],
		],
	],
];
const Edit = () => {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		templateLock: 'all',
	} );
	return (
		<div className="fin-block-form-submit-wrapper" { ...innerBlocksProps } />
	);
};
export default Edit;
