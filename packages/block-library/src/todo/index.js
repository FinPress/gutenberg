/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';
import initBlock from '../utils/init-block';

/* Block settings */
const { name } = metadata;
export { metadata, name };

export const settings = {
	edit,
};

export const init = () => initBlock( { name, metadata, settings } );
