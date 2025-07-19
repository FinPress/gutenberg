/**
 * External dependencies
 */

const glob = require( 'glob' );

const entryPoints = glob.sync( './blocks/**/index.js' );

module.exports = {
	entry: entryPoints,
	// ...rest of your webpack config
};
