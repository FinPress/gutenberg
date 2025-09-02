/**
 * External dependencies
 */
const { Engine } = require( 'php-parser' );

const phpEngine = new Engine( {
	parser: {
		debug: false,
		locations: true,
		extractDoc: false,
		suppressErrors: false,
	},
	ast: {
		withPositions: true,
	},
} );

/**
 * Checks if code contains the Gutenberg plugin conditional
 *
 * @param {string} codeString The PHP code to check
 * @param {number} start      Start position
 * @param {number} end        End position
 * @return {boolean} Whether the code contains the conditional
 */
function containsGutenbergPluginCode( codeString, start, end ) {
	const nodeCode = codeString.substring( start, end );
	return nodeCode.includes( 'IS_GUTENBERG_PLUGIN' );
}

/**
 * Recursively searches for if statements with the target conditional
 *
 * @param {Object} node           AST node
 * @param {string} phpCode        Original PHP code
 * @param {Array}  rangesToRemove Array to collect ranges for removal
 */
function findNodesToRemove( node, phpCode, rangesToRemove ) {
	if ( ! node || typeof node !== 'object' ) {
		return;
	}

	if ( node.kind === 'if' && node.loc ) {
		const start = node.loc.start.offset;
		const end = node.loc.end.offset;

		if ( containsGutenbergPluginCode( phpCode, start, end ) ) {
			rangesToRemove.push( { start, end } );
			return;
		}
	}

	if ( Array.isArray( node ) ) {
		for ( const child of node ) {
			findNodesToRemove( child, phpCode, rangesToRemove );
		}
	} else {
		for ( const prop in node ) {
			if (
				Object.prototype.hasOwnProperty.call( node, prop ) &&
				node[ prop ] &&
				typeof node[ prop ] === 'object'
			) {
				findNodesToRemove( node[ prop ], phpCode, rangesToRemove );
			}
		}
	}
}

/**
 * Removes if statements containing IS_GUTENBERG_PLUGIN
 *
 * @param {string} phpCode The PHP code to process
 * @return {string} The processed PHP code
 */
function removeGutenbergPluginConditionals( phpCode ) {
	try {
		const ast = phpEngine.parseCode( phpCode, 'index.php' );
		const rangesToRemove = [];

		findNodesToRemove( ast, phpCode, rangesToRemove );

		if ( rangesToRemove.length === 0 ) {
			return phpCode;
		}

		rangesToRemove.sort( ( a, b ) => b.start - a.start );

		let result = phpCode;

		for ( const { start, end } of rangesToRemove ) {
			result = result.substring( 0, start ) + result.substring( end );
		}

		return result;
	} catch ( error ) {
		return phpCode;
	}
}

module.exports = { removeGutenbergPluginConditionals };
