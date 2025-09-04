/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { queryPaginationPrevious as icon } from '@finpress/icons';

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
	edit,
	example: {
		attributes: {
			label: __( 'Older Comments' ),
		},
	},
};

export const init = () => initBlock( { name, metadata, settings } );
