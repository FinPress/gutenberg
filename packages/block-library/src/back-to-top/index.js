/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { arrowUp as icon } from '@wordpress/icons';
/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import metadata from './block.json';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	example: {
		attributes: {
			content: __( 'Back to top' ),
			buttonPosition: 'right',
		},
	},
	edit,
	save,
};

export const privateApis = {};

export const init = () => {
	return registerBlockType( name, {
		...metadata,
		...settings,
	} );
};
