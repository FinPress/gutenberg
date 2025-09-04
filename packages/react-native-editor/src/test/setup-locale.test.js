/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import setupLocale from '../setup-locale';

const getDefaultTranslation = () => ( {
	'default-string': [ 'default-string-translation' ],
} );

const extraTranslations = {
	'extra-string': [ 'extra-string-translation' ],
};

const pluginTranslations = [
	{
		domain: 'domain-1',
		getTranslation: () => ( {
			'domain-1-string': [ 'domain-1-string-translation' ],
		} ),
	},
];

describe( 'Setup locale', () => {
	it( 'sets up default domain translations', () => {
		setupLocale( 'test', extraTranslations, getDefaultTranslation );

		expect( __( 'default-string' ) ).toBe( 'default-string-translation' );
		expect( __( 'extra-string' ) ).toBe( 'extra-string-translation' );
	} );

	it( 'sets up plugin translations', () => {
		const domain = 'domain-1';

		setupLocale(
			'test',
			extraTranslations,
			getDefaultTranslation,
			pluginTranslations
		);

		/* eslint-disable @finpress/i18n-text-domain */
		expect( __( 'domain-1-string', domain ) ).toBe(
			'domain-1-string-translation'
		);
		expect( __( 'extra-string', domain ) ).toBe(
			'extra-string-translation'
		);
		/* eslint-enable @finpress/i18n-text-domain */
	} );
} );
