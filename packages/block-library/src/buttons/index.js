/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { buttons as icon } from '@finpress/icons';

/**
 * Internal dependencies
 */
import initBlock from '../utils/init-block';
import deprecated from './deprecated';
import transforms from './transforms';
import edit from './edit';
import metadata from './block.json';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	example: {
		attributes: {
			layout: {
				type: 'flex',
				justifyContent: 'center',
			},
		},
		innerBlocks: [
			{
				name: 'core/button',
				attributes: { text: __( 'Find out more' ) },
			},
			{
				name: 'core/button',
				attributes: { text: __( 'Contact us' ) },
			},
		],
	},
	deprecated,
	transforms,
	edit,
	save,
};

export const init = () => initBlock( { name, metadata, settings } );
