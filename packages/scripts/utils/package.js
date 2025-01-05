/**
 * External dependencies
 */
import { realpathSync } from 'fs';
import { readPackageUpSync } from 'read-package-up';

/**
 * Internal dependencies
 */
import { getCurrentWorkingDirectory } from './process.js';

const { packageJson, path: pkgPath } = readPackageUpSync( {
	cwd: realpathSync( getCurrentWorkingDirectory() ),
} );

const getPackagePath = () => pkgPath;

const getPackageProp = ( prop ) => packageJson && packageJson[ prop ];

const hasPackageProp = ( prop ) =>
	packageJson && packageJson.hasOwnProperty( prop );

export { getPackagePath, getPackageProp, hasPackageProp };
