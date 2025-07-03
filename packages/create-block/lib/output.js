/**
 * External dependencies
 */
const { dirname, join } = require( 'path' );
const makeDir = require( 'make-dir' );
const { render } = require( 'mustache' );
const { writeFile } = require( 'fs' ).promises;

const writeOutputAsset = async ( inputFile, outputFile, view ) => {
	const outputFilePath = join( view.rootDirectory, 'assets', outputFile );
	await makeDir( dirname( outputFilePath ) );
	writeFile( outputFilePath, inputFile );
};

const writeOutputTemplate = async ( inputFile, outputFile, view ) => {
	// If the rendered template is empty, don't write it. This is how we can conditionally add template files.
	const renderedFile = render( inputFile, view );
	if ( renderedFile.trim().length ) {
		const isCssVariant = view.variantVars && view.variantVars.isCssVariant;
		const isScssFile = outputFile.endsWith( '.scss' );
		const isCssFile = outputFile.endsWith( '.css' );

		// Only apply filtering for the 'standard' template variants
		// Don't filter CSS files for other templates like 'es5' that naturally use CSS
		const isStandardTemplate = view.wpScripts !== false; // ES5 template has wpScripts: false

		if ( isStandardTemplate ) {
			if ( isCssVariant && isScssFile ) {
				return;
			}

			if (
				! isCssVariant &&
				isCssFile &&
				( outputFile.includes( 'editor.css' ) ||
					outputFile.includes( 'style.css' ) )
			) {
				return;
			}
		}

		const outputFilePath = join( view.rootDirectory, outputFile );
		await makeDir( dirname( outputFilePath ) );
		writeFile(
			outputFilePath.replace( /\$slug/g, view.slug ),
			renderedFile
		);
	}
};

module.exports = {
	writeOutputAsset,
	writeOutputTemplate,
};
