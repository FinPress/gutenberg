/**
 * Webpack loader that converts WASM and JS files to Base64 data URLs
 * This allows inlining binary files to avoid server configuration issues
 */

const fs = require( 'fs' );
const path = require( 'path' );

module.exports = function wasmLoader( content ) {
	const callback = this.async();
	const resourcePath = this.resourcePath;

	// Debug: log when loader is called
	console.log( 'WASM Loader called for:', resourcePath );

	// Add the file as a dependency so webpack watches it for changes
	this.addDependency( resourcePath );

	try {
		// Read the file as a buffer
		const buffer = fs.readFileSync( resourcePath );

		// Convert to base64
		const base64 = buffer.toString( 'base64' );

		// Determine MIME type based on file extension
		let mimeType;
		const ext = path.extname( resourcePath ).toLowerCase();

		switch ( ext ) {
			case '.wasm':
				mimeType = 'application/wasm';
				break;
			case '.js':
				mimeType = 'application/javascript';
				break;
			default:
				mimeType = 'application/octet-stream';
		}

		// Create data URL
		const dataUrl = `data:${ mimeType };base64,${ base64 }`;

		// Export as ES6 module
		const output = `export default ${ JSON.stringify( dataUrl ) };`;

		callback( null, output );
	} catch ( error ) {
		callback( error );
	}
};

// Tell webpack this loader works with binary files
module.exports.raw = true;
