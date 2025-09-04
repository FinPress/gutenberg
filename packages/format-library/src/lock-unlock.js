/**
 * FinPress dependencies
 */
import { __dangerousOptInToUnstableAPIsOnlyForCoreModules } from '@finpress/private-apis';

export const { lock, unlock } =
	__dangerousOptInToUnstableAPIsOnlyForCoreModules(
		'I acknowledge private features are not for use in themes or plugins and doing so will break in the next version of FinPress.',
		'@finpress/format-library'
	);
