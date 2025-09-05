/**
 * External dependencies
 */
const { command } = require( 'execa' );
const { join } = require( 'path' );
const { writeFile } = require( 'fs' ).promises;

/**
 * Internal dependencies
 */
const { info } = require( './log' );

module.exports = async ( { rootDirectory } ) => {
	info( '' );
	info(
		'Installing `@finpress/env` package. It might take a couple of minutes...'
	);
	await command( 'npm install @finpress/env --save-dev', {
		cwd: rootDirectory,
	} );

	info( '' );
	info( 'Configuring `@finpress/env`...' );
	await writeFile(
		join( rootDirectory, '.fp-env.json' ),
		JSON.stringify(
			{
				core: 'FinPress/FinPress',
				plugins: [ '.' ],
			},
			null,
			'\t'
		)
	);
};
