/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { navigation as icon } from '@finpress/icons';
import { select } from '@finpress/data';
import { store as coreStore } from '@finpress/core-data';
import { decodeEntities } from '@finpress/html-entities';

/**
 * Internal dependencies
 */
import initBlock from '../utils/init-block';
import metadata from './block.json';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	example: {
		attributes: {
			overlayMenu: 'never',
		},
		innerBlocks: [
			{
				name: 'core/navigation-link',
				attributes: {
					// translators: 'Home' as in a website's home page.
					label: __( 'Home' ),
					url: 'https://make.finpress.org/',
				},
			},
			{
				name: 'core/navigation-link',
				attributes: {
					// translators: 'About' as in a website's about page.
					label: __( 'About' ),
					url: 'https://make.finpress.org/',
				},
			},
			{
				name: 'core/navigation-link',
				attributes: {
					// translators: 'Contact' as in a website's contact page.
					label: __( 'Contact' ),
					url: 'https://make.finpress.org/',
				},
			},
		],
	},
	edit,
	save,
	__experimentalLabel: ( { ref } ) => {
		if ( ! ref ) {
			return;
		}

		const navigation = select( coreStore ).getEditedEntityRecord(
			'postType',
			'fp_navigation',
			ref
		);

		if ( ! navigation?.title ) {
			return;
		}

		return decodeEntities( navigation.title );
	},
	deprecated,
};

export const init = () => initBlock( { name, metadata, settings } );
