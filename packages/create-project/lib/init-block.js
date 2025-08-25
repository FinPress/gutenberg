/**
 * External dependencies
 */
const { join } = require( 'path' );
const makeDir = require( 'make-dir' );
const { writeFile } = require( 'fs' ).promises;

/**
 * Internal dependencies
 */
const { info } = require( './log' );
const { writeOutputTemplate } = require( './output' );

async function initBlockJSON( {
	$schema,
	apiVersion,
	type,
	plugin,
	theme,
	slug,
	namespace,
	title,
	version,
	description,
	category,
	attributes,
	supports,
	dashicon,
	textdomain,
	folderName,
	editorScript,
	editorStyle,
	style,
	viewStyle,
	render,
	viewScriptModule,
	viewScript,
	customBlockJSON,
	example,
	rootDirectory,
} ) {
	info( '' );
	info( 'Creating a "block.json" file.' );

	// Determine where to place the block.json file
	let blockFolderName;
	if ( type === 'block' ) {
		// Standalone block goes in the root directory
		blockFolderName = rootDirectory;
	} else if ( plugin || theme ) {
		// Block within plugin/theme goes in the folderName directory
		blockFolderName = join( rootDirectory, folderName );
	} else {
		// Default to root directory
		blockFolderName = rootDirectory;
	}

	await makeDir( blockFolderName );

	await writeFile(
		join( blockFolderName, 'block.json' ),
		JSON.stringify(
			Object.fromEntries(
				Object.entries( {
					$schema,
					apiVersion,
					name: namespace + '/' + slug,
					version,
					title,
					category,
					icon: dashicon,
					description,
					example,
					attributes,
					supports,
					textdomain,
					editorScript,
					editorStyle,
					style,
					viewStyle,
					render,
					viewScriptModule,
					viewScript,
					...customBlockJSON,
				} ).filter( ( [ , value ] ) => !! value )
			),
			null,
			'\t'
		)
	);
}

module.exports = async function ( outputTemplates, view ) {
	// Only scaffold block templates if we have them
	if ( Object.keys( outputTemplates ).length > 0 ) {
		await Promise.all(
			Object.keys( outputTemplates ).map( async ( outputFile ) => {
				// Determine the output path based on project type
				let outputPath;
				if ( view.type === 'block' ) {
					// Standalone block files go in root
					outputPath = outputFile.replace( /\$slug/g, view.slug );
				} else {
					// Block files within plugin/theme go in folderName
					outputPath = join(
						view.folderName || 'src',
						outputFile.replace( /\$slug/g, view.slug )
					);
				}

				await writeOutputTemplate(
					outputTemplates[ outputFile ],
					outputPath,
					view
				);
			} )
		);
	}

	// Only create block.json if we're dealing with blocks
	if ( view.type === 'block' || view.withBlocks ) {
		await initBlockJSON( view );
	}
};
