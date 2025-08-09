/**
 * @fileoverview Disallow usage of the order CSS property.
 */

'use strict';

module.exports = {
	rules: {
		'no-css-order-property': {
			meta: {
				type: 'problem',
				docs: {
					description: 'Disallow usage of the order CSS property',
					category: 'Best Practices',
				},
				messages: {
					noOrder: 'Usage of order CSS property is not allowed.',
				},
				schema: [],
			},
			create( context ) {
				return {
					// Check inline style object in JSX
					JSXAttribute( node ) {
						if (
							node.name &&
							node.name.name === 'style' &&
							node.value &&
							node.value.expression &&
							node.value.expression.properties
						) {
							node.value.expression.properties.forEach( ( prop ) => {
								if (
									prop.key &&
									prop.key.name &&
									prop.key.name.toLowerCase() === 'order'
								) {
									context.report({
										node: prop,
										messageId: 'noOrder',
									});
								}
							} );
						}
					},
					// Check CSS-in-JS template literals
					TemplateElement( node ) {
						if ( node.value.raw.includes( 'order' ) ) {
							context.report({
								node,
								messageId: 'noOrder',
							});
						}
					},
				};
			},
		},
	},
};
