/** @type {import('stylelint').Config} */
module.exports = {
	extends: '@wordpress/stylelint-config/scss-stylistic',
	rules: {
		'at-rule-empty-line-before': null,
		'at-rule-no-unknown': null,
		'comment-empty-line-before': null,
		'declaration-property-value-disallowed-list': [
			{
				'flex-direction': [ '/-reverse$/' ],
				'/.*/': [ '/--wp-components-color-/' ],
			},
			{
				message: ( property, value ) => {
					// Don't allow reverse values for flex-direction.
					if (
						property === 'flex-direction' &&
						/-reverse$/.test( value )
					) {
						return `Avoid "${ value }" value for the "${ property }" property. For accessibility reasons, visual, reading, and DOM order must match. Only use the reverse values when they do not affect reading order, meaning, and interaction.`;
					}
					// Don't allow --wp-components-color-* variables outside of the components package.
					if ( /--wp-components-color-/.test( value ) ) {
						return `Avoid using "${ value }" in "${ property }". --wp-components-color-* variables are not ready to be used outside of the components package.`;
					}
					return `Avoid "${ value }" for "${ property }".`;
				},
			},
		],
		'font-weight-notation': null,
		'@stylistic/max-line-length': null,
		'no-descending-specificity': null,
		'property-disallowed-list': [
			[ 'order' ],
			{
				message:
					'Avoid the order property. For accessibility reasons, visual, reading, and DOM order must match. Only use the order property when it does not affect reading order, meaning, and interaction.',
			},
		],
		'rule-empty-line-before': null,
		'selector-class-pattern': null,
		'value-keyword-case': null,
		'scss/operator-no-unspaced': null,
		'scss/selector-no-redundant-nesting-selector': null,
		'scss/load-partial-extension': null,
		'scss/no-global-function-names': null,
		'scss/comment-no-empty': null,
		'scss/at-extend-no-missing-placeholder': null,
		'scss/operator-no-newline-after': null,
		'scss/at-if-closing-brace-newline-after': null,
		'scss/at-else-empty-line-before': null,
		'scss/at-if-closing-brace-space-after': null,
		'no-invalid-position-at-import-rule': null,
	},
	reportDescriptionlessDisables: true,
};
