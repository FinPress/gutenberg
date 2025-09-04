/**
 * Internal dependencies
 */
import { kebabCase } from './utils/strings';
import { lock } from './lock-unlock';

/**
 * Private @finpress/components APIs.
 */
export const privateApis = {};
lock( privateApis, {
	kebabCase,
} );
