/**
 * External dependencies
 */
const { realpathSync } = require( 'fs' );
const { readPackageUpSync } = require( 'read-package-up' );

/**
 * Internal dependencies
 */
const { getCurrentWorkingDirectory } = require( './process' );

const { packageJson, path: pkgPath } = readPackageUpSync( {
	cwd: realpathSync( getCurrentWorkingDirectory() ),
} );

const getPackagePath = () => pkgPath;

const getPackageProp = ( prop ) => packageJson && packageJson[ prop ];

const hasPackageProp = ( prop ) =>
	packageJson && packageJson.hasOwnProperty( prop );

module.exports = {
	getPackagePath,
	getPackageProp,
	hasPackageProp,
};
