/**
 * WordPress dependencies
 */
import deprecated from '@wordpress/deprecated';

/**
 * Internal dependencies
 */
import { deprecatedEntities } from '../entities';

let loggedAlready = false;

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
	let alternativeMessage = `the '${ alternative.kind }', '${ alternative.name }' entity`;

	if ( alternativeFunctionName ) {
		alternativeMessage += ` via the '${ alternativeFunctionName }' function`;
	}

	if ( ! loggedAlready ) {
		deprecated(
			`The '${ kind }', '${ name }' entity (used via '${ functionName }')`,
			{
				...deprecation,
				alternative: alternativeMessage,
			}
		);
	}

	// Only log an entity deprecation once per call stack,
	// else there's spurious logging when selections or actions call through to other selectors or actions.
	loggedAlready = true;
	// At the end of the call stack, reset the flag.
	setTimeout( () => {
		loggedAlready = false;
	}, 0 );
}
