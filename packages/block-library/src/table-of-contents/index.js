/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { tableOfContents as icon } from '@wordpress/icons';
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import initBlock from '../utils/init-block';
import metadata from './block.json';
import edit from './edit';
import save from './save';
import withHeadingTOCControls from './with-heading-controls';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	edit,
	save,
	example: {
		innerBlocks: [
			{
				name: 'core/heading',
				attributes: {
					level: 2,
					content: __( 'Heading' ),
				},
			},
			{
				name: 'core/heading',
				attributes: {
					level: 3,
					content: __( 'Subheading' ),
				},
			},
			{
				name: 'core/heading',
				attributes: {
					level: 2,
					content: __( 'Heading' ),
				},
			},
			{
				name: 'core/heading',
				attributes: {
					level: 3,
					content: __( 'Subheading' ),
				},
			},
		],
		attributes: {
			headings: [
				{
					content: __( 'Heading' ),
					level: 2,
				},
				{
					content: __( 'Subheading' ),
					level: 3,
				},
				{
					content: __( 'Heading' ),
					level: 2,
				},
				{
					content: __( 'Subheading' ),
					level: 3,
				},
			],
		},
	},
};

export const init = () => {
	// Register the HOC to add TOC controls to heading blocks
	addFilter(
		'editor.BlockEdit',
		'core/table-of-contents/with-heading-controls',
		withHeadingTOCControls
	);

	return initBlock( { name, metadata, settings } );
};
