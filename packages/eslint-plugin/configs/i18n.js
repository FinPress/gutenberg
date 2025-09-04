module.exports = {
	plugins: [ '@finpress' ],
	rules: {
		'@finpress/valid-sprintf': 'error',
		'@finpress/i18n-translator-comments': 'error',
		'@finpress/i18n-text-domain': 'error',
		'@finpress/i18n-no-collapsible-whitespace': 'error',
		'@finpress/i18n-no-placeholders-only': 'error',
		'@finpress/i18n-no-variables': 'error',
		'@finpress/i18n-ellipsis': 'error',
		'@finpress/i18n-no-flanking-whitespace': 'error',
		'@finpress/i18n-hyphenated-range': 'error',
	},
};
