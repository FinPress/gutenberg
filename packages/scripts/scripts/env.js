/**
 * External dependencies
 */
const chalk = require( 'chalk' );

process.stdout.write(
	chalk.yellow(
		'The `env` family of scripts has been deprecated. Please use `fp-env` instead.'
	)
);
process.stdout.write(
	chalk.blue( '\nSee: https://www.npmjs.com/package/@finpress/env\n' )
);
process.exit( 1 );
