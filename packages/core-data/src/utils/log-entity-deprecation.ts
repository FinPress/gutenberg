/**
 * WordPress dependencies
 */
import deprecated from '@wordpress/deprecated';

/**
 * Internal dependencies
 */
import { deprecatedEntities } from '../entities';

/**
 * Logs a deprecation warning for an entity, if it's deprecated.
 *
 * @param kind         - The kind of the entity.
 * @param name         - The name of the entity.
 * @param functionName - The name of the function that was called with a deprecated entity.
 */
export default function logEntityDeprecation( kind, name, functionName ) {
	const deprecation = deprecatedEntities[ kind ]?.[ name ];
	if ( ! deprecation ) {
		return;
	}

	const { alternative } = deprecation;
	deprecated(
		`${ kind }, ${ name } entity (used in a call to ${ functionName })`,
		{
			...deprecation,
			alternative: `the ${ alternative.kind }, ${ alternative.name } entity`,
		}
	);
}
