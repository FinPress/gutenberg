/**
 * External dependencies
 */
import pc from 'picocolors';

process.stdout.write(
	pc.yellow(
		'The `env` family of scripts has been deprecated. Please use `wp-env` instead.'
	)
);
process.stdout.write(
	pc.blue( '\nSee: https://www.npmjs.com/package/@wordpress/env\n' )
);
process.exit( 1 );
