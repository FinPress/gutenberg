/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

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

/*
 * Edit - The edit function for the custom block, defining its structure and behavior in the block editor.
 *
 * @returns {JSX.Element} The rendered edit component.
 */
const Edit = () => {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		templateLock: 'all',
	} );
	return (
		<div className="wp-block-form-submit-wrapper" { ...innerBlocksProps } />
	);
};
export default Edit;
