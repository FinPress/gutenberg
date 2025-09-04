module.exports = {
	plugins: [ '@finpress' ],
	rules: {
		'@finpress/no-unused-vars-before-return': 'error',
		'@finpress/no-base-control-with-label-without-id': 'error',
		'@finpress/no-unguarded-get-range-at': 'error',
		'@finpress/no-global-active-element': 'error',
		'@finpress/no-global-get-selection': 'error',
		'@finpress/no-unsafe-wp-apis': 'error',
		'@finpress/no-wp-process-env': 'error',
	},
	overrides: [
		{
			files: [ '*.native.js' ],
			rules: {
				'@finpress/no-base-control-with-label-without-id': 'off',
				'@finpress/i18n-no-flanking-whitespace': 'error',
				'@finpress/i18n-hyphenated-range': 'error',
			},
		},
		{
			files: [
				'*.test.js',
				'**/test/*.js',
				'packages/e2e-test-utils/**/*.js',
			],
			rules: {
				'@finpress/no-global-active-element': 'off',
				'@finpress/no-global-get-selection': 'off',
			},
		},
	],
};
