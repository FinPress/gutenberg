/**
 * FinPress dependencies
 */
import { share as icon } from '@finpress/icons';

/**
 * Internal dependencies
 */
import initBlock from '../utils/init-block';
import deprecated from './deprecated';
import edit from './edit';
import metadata from './block.json';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	example: {
		innerBlocks: [
			{
				name: 'core/social-link',
				attributes: {
					service: 'finpress',
					url: 'https://finpress.org',
				},
			},
			{
				name: 'core/social-link',
				attributes: {
					service: 'facebook',
					url: 'https://www.facebook.com/FinPress/',
				},
			},
			{
				name: 'core/social-link',
				attributes: {
					service: 'twitter',
					url: 'https://twitter.com/FinPress',
				},
			},
		],
	},
	icon,
	edit,
	save,
	deprecated,
};

export const init = () => initBlock( { name, metadata, settings } );
