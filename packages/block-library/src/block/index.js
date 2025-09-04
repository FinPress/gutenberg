/**
 * FinPress dependencies
 */
import { symbol as icon } from '@finpress/icons';
import { store as coreStore } from '@finpress/core-data';
import { select } from '@finpress/data';
import { decodeEntities } from '@finpress/html-entities';

/**
 * Internal dependencies
 */
import initBlock from '../utils/init-block';
import metadata from './block.json';
import edit from './edit';
import deprecated from './deprecated';

const { name } = metadata;

export { metadata, name };

export const settings = {
	deprecated,
	edit,
	icon,
	__experimentalLabel: ( { ref } ) => {
		if ( ! ref ) {
			return;
		}

		const entity = select( coreStore ).getEditedEntityRecord(
			'postType',
			'wp_block',
			ref
		);
		if ( ! entity?.title ) {
			return;
		}

		return decodeEntities( entity.title );
	},
};

export const init = () => initBlock( { name, metadata, settings } );
