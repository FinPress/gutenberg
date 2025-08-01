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
 * @param kind                    - The kind of the entity.
 * @param name                    - The name of the entity.
 * @param functionName            - The name of the function that was called with a deprecated entity.
 * @param alternativeFunctionName - The name of the alternative function that should be used instead.
 */
export default function logEntityDeprecation(
	kind: string,
	name: string,
	functionName: string,
	alternativeFunctionName?: string
) {
	const deprecation = deprecatedEntities[ kind ]?.[ name ];
	if ( ! deprecation ) {
		return;
	}

	const { alternative } = deprecation;
	let alternativeMessage = `The '${ alternative.kind }', '${ alternative.name }' entity`;

	if ( alternativeFunctionName ) {
		alternativeMessage += ` via the '${ alternativeFunctionName }' function`;
	}

	deprecated(
		`The '${ kind }', '${ name }' entity (used via '${ functionName }')`,
		{
			...deprecation,
			alternative: alternativeMessage,
		}
	);
}
