/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { postAuthor as icon } from '@finpress/icons';

/**
 * Internal dependencies
 */
import initBlock from '../utils/init-block';
import metadata from './block.json';
import edit from './edit';

const { name } = metadata;
export { metadata, name };

export const settings = {
	icon,
	example: {
		viewportWidth: 350,
		attributes: {
			showBio: true,
			byline: __( 'Posted by' ),
		},
	},
	edit,
};

export const init = () => initBlock( { name, metadata, settings } );
