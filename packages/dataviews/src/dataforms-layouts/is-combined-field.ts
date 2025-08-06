/**
 * Internal dependencies
 */
import type { FormField, CombinedFormField } from '../types';

export function isCombinedField( field: any ): field is CombinedFormField {
	return ( field as CombinedFormField ).children !== undefined;
}
