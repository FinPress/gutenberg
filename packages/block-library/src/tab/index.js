/**
 * WordPress dependencies
 */
import { tab as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import initBlock from '../utils/init-block';
import metadata from './block.json';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	edit,
	save,
};

export const init = () => initBlock( { name, metadata, settings } );
