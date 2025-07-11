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

		// Helper to check if a property is likely CSS-related
		function isLikelyCSSContext( node ) {
			// Check if the property is part of an object that contains other CSS properties
			if (
				node.parent &&
				node.parent.type === 'Property' &&
				node.parent.parent &&
				node.parent.parent.type === 'ObjectExpression'
			) {
				const objectProps = node.parent.parent.properties;
				const cssProperties = new Set( [
					'display',
					'position',
					'top',
					'right',
					'bottom',
					'left',
					'width',
					'height',
					'margin',
					'padding',
					'border',
					'background',
					'color',
					'font',
					'fontSize',
					'fontFamily',
					'fontWeight',
					'textAlign',
					'textDecoration',
					'lineHeight',
					'overflow',
					'opacity',
					'visibility',
					'zIndex',
					'cursor',
					'transition',
					'transform',
					'animation',
					'boxShadow',
					'borderRadius',
					'flexDirection',
					'justifyContent',
					'alignItems',
					'flexWrap',
					'flex',
					'flexGrow',
					'flexShrink',
					'flexBasis',
					'alignSelf',
					'gridTemplateColumns',
					'gridTemplateRows',
					'gridColumn',
					'gridRow',
					'gap',
					'rowGap',
					'columnGap',
				] );

				// Check if any sibling properties are CSS properties
				for ( const prop of objectProps ) {
					let keyName;
					if ( prop.key.type === 'Identifier' ) {
						keyName = prop.key.name;
					} else if ( prop.key.type === 'Literal' ) {
						keyName = prop.key.value;
					} else {
						keyName = null;
					}
					if ( keyName && cssProperties.has( keyName ) ) {
						return true;
					}
				}
			}

			return false;
		}

		// Helper to check if we're in a CSS object based on variable declaration
		function isInCSSObjectDeclaration( node ) {
			let current = node;
			while ( current ) {
				// Check if we're in a VariableDeclarator
				if (
					current.type === 'VariableDeclarator' &&
					current.id &&
					current.id.type === 'Identifier'
				) {
					const varName = current.id.name;
					if ( isCSSRelatedName( varName ) ) {
						return true;
					}
				}

				// Check if we're in a Property assignment (for object properties)
				if ( current.type === 'Property' && current.key ) {
					let keyName;
					if ( current.key.type === 'Identifier' ) {
						keyName = current.key.name;
					} else if ( current.key.type === 'Literal' ) {
						keyName = current.key.value;
					} else {
						keyName = null;
					}
					if ( keyName && isCSSRelatedName( keyName ) ) {
						return true;
					}
				}

				current = current.parent;
			}
			return false;
		}

		// Helper to check if a variable/object name suggests CSS context
		function isCSSRelatedName( name ) {
			if ( ! name || typeof name !== 'string' ) {
				return false;
			}

			const cssPatterns = [
				/^style$/i, // Exact match for 'style'
				/^styles$/i, // Exact match for 'styles'
				/^css$/i, // Exact match for 'css'
				/^theme$/i, // Exact match for 'theme'
				/^sx$/i, // MUI sx prop
				/^styled/i, // Starts with 'styled'
				/style$/i, // Ends with 'style'
				/styles$/i, // Ends with 'styles'
				/css$/i, // Ends with 'css'
				/styling/i, // Contains 'styling'
				/className/i, // Contains 'className'
				/classes/i, // Contains 'classes'
			];

			return cssPatterns.some( ( pattern ) => pattern.test( name ) );
		}

		// Helper to check if we're in a CSS-in-JS context (styled-components, emotion, etc.)
		function isInCSSInJSContext( node ) {
			let current = node;
			while ( current ) {
				// Check for tagged template literals (styled-components)
				if ( current.type === 'TaggedTemplateExpression' ) {
					const tag = current.tag;
					if (
						tag.type === 'Identifier' &&
						/^styled/i.test( tag.name )
					) {
						return true;
					}
					if (
						tag.type === 'MemberExpression' &&
						tag.object &&
						tag.object.name === 'styled'
					) {
						return true;
					}
				}

				// Check for css`` template literals
				if (
					current.type === 'TaggedTemplateExpression' &&
					current.tag.type === 'Identifier' &&
					current.tag.name === 'css'
				) {
					return true;
				}

				// Check for function calls that might be CSS-in-JS
				if ( current.type === 'CallExpression' ) {
					const callee = current.callee;
					if (
						callee.type === 'Identifier' &&
						( callee.name === 'css' || callee.name === 'styled' )
					) {
						return true;
					}
				}

				current = current.parent;
			}
			return false;
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
					// Check multiple contexts:
					// 1. Object contains other CSS properties
					// 2. Object is assigned to a CSS-related variable
					// 3. We're in a CSS-in-JS context
					if (
						isLikelyCSSContext( node.key ) ||
						isInCSSObjectDeclaration( node ) ||
						isInCSSInJSContext( node )
					) {
						report( node.key );
					}
				}
			},
			// Detect order in template literals (CSS-in-JS)
			TemplateElement( node ) {
				// Only match 'order' as a standalone property, not as part of another word (e.g., 'border')
				if ( /(^|\s|;)order\s*:/i.test( node.value.raw ) ) {
					// Template literals in CSS-in-JS are usually already in the right context
					if ( isInCSSInJSContext( node ) ) {
						report( node );
					}
				}
			},
			// Detect order in string literals
			Literal( node ) {
				if (
					typeof node.value === 'string' &&
					/(^|\s|;)order\s*:/i.test( node.value )
				) {
					// Be more conservative with string literals
					if ( isInCSSInJSContext( node ) ) {
						report( node );
					}
				}
			},
			// Detect assignments like myDiv.style.order = XXX (complex but effective)
			AssignmentExpression( node ) {
				const left = node.left;

				// Helper to check if a MemberExpression is .order
				function isOrderProperty( memberExpr ) {
					return (
						memberExpr.type === 'MemberExpression' &&
						! memberExpr.computed &&
						memberExpr.property.type === 'Identifier' &&
						memberExpr.property.name === 'order'
					);
				}

				// Helper to check if a MemberExpression is .style
				function isStyleProperty( memberExpr ) {
					return (
						memberExpr.type === 'MemberExpression' &&
						! memberExpr.computed &&
						memberExpr.property.type === 'Identifier' &&
						memberExpr.property.name === 'style'
					);
				}

				// Case 1: div.style.order = '123'; (this is clearly CSS-related)
				if (
					isOrderProperty( left ) &&
					isStyleProperty( left.object )
				) {
					report( left.property );
				}

				// Case 2: theS.order = '123'; where theS might be assigned to div.style
				// Be more careful here - only report if the object name suggests CSS context
				else if ( isOrderProperty( left ) ) {
					const objectName =
						left.object.type === 'Identifier'
							? left.object.name
							: null;
					if ( objectName && isCSSRelatedName( objectName ) ) {
						report( left.property );
					}
				}
			},

			// Detect setAttribute with style attribute containing order
			CallExpression( node ) {
				// Check for setAttribute calls
				if (
					node.callee &&
					node.callee.type === 'MemberExpression' &&
					node.callee.property &&
					node.callee.property.type === 'Identifier' &&
					node.callee.property.name === 'setAttribute' &&
					node.arguments &&
					node.arguments.length >= 2
				) {
					const firstArg = node.arguments[ 0 ];
					const secondArg = node.arguments[ 1 ];

					// Check if first argument is 'style' (string literal)
					if (
						firstArg.type === 'Literal' &&
						firstArg.value === 'style' &&
						secondArg.type === 'Literal' &&
						typeof secondArg.value === 'string'
					) {
						// Check if the style string contains 'order:'
						if ( /(^|\s|;)order\s*:/i.test( secondArg.value ) ) {
							report( secondArg );
						}
					}
				}
			},
		};
	},
};
