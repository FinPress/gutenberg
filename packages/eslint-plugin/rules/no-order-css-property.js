/**
 * @file Disallow usage of the 'order' CSS property in CSS-in-JS for accessibility reasons.
 */

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
	meta: {
		type: 'problem',
		messages: {
			noOrder:
				"Avoid the 'order' CSS property. For accessibility reasons, visual, reading, and DOM order must match. Only use the order property when it does not affect reading order, meaning, and interaction.",
		},
		schema: [],
	},
	create( context ) {
		function report( node ) {
			context.report( {
				node,
				messageId: 'noOrder',
			} );
		}

		return {
			// Detect order in object styles: { order: ... }
			Property( node ) {
				if (
					node.key &&
					( ( node.key.type === 'Identifier' &&
						node.key.name === 'order' ) ||
						( node.key.type === 'Literal' &&
							node.key.value === 'order' ) )
				) {
					report( node.key );
				}
			},
			// Detect order in template literals (CSS-in-JS)
			TemplateElement( node ) {
				if ( /order\s*:/i.test( node.value.raw ) ) {
					report( node );
				}
			},
			// Detect order in string literals
			Literal( node ) {
				if (
					typeof node.value === 'string' &&
					/order\s*:/i.test( node.value )
				) {
					report( node );
				}
			},
		};
	},
};
