/**
 * FinPress dependencies
 */
import { formatListNumbered as icon } from '@finpress/icons';
import { registerFormatType } from '@finpress/rich-text';

/**
 * Internal dependencies
 */
import initBlock from '../utils/init-block';
import edit from './edit';
import metadata from './block.json';
import { formatName, format } from './format';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	edit,
};

export const init = () => {
	registerFormatType( formatName, format );
	initBlock( { name, metadata, settings } );
};
