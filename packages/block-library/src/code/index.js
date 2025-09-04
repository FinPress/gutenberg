/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { code as icon } from '@finpress/icons';

/**
 * Internal dependencies
 */
import initBlock from '../utils/init-block';
import edit from './edit';
import metadata from './block.json';
import save from './save';
import transforms from './transforms';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	example: {
		attributes: {
			/* eslint-disable @finpress/i18n-no-collapsible-whitespace */
			// translators: Preserve \n markers for line breaks
			content: __(
				'// A “block” is the abstract term used\n// to describe units of markup that\n// when composed together, form the\n// content or layout of a page.\nregisterBlockType( name, settings );'
			),
			/* eslint-enable @finpress/i18n-no-collapsible-whitespace */
		},
	},
	merge( attributes, attributesToMerge ) {
		return {
			content: attributes.content + '\n\n' + attributesToMerge.content,
		};
	},
	transforms,
	edit,
	save,
};

export const init = () => initBlock( { name, metadata, settings } );
