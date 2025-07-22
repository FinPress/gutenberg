/**
 * WordPress dependencies
 */
import deprecated from '@wordpress/deprecated';

/**
 * Internal dependencies
 */
import { deprecatedEntities } from '../entities';

/**
 * Normalize selector arguments to handle deprecated entities.
 *
 * When a selector is called with the kind/name of a deprecated entity
 *
 * @param args             The arguments to normalize.
 * @param functionName     The name of the function to normalize.
 * @param position         The position of the kind and name in the arguments.
 * @param position.kindArg The position of the kind in the arguments.
 * @param position.nameArg The position of the name in the arguments.
 *
 * @return The normalized arguments.
 */
export function normalizeDeprecatedEntityArgs< ArgsType extends any[] >(
	args: ArgsType,
	functionName: string,
	position: { kindArg: number; nameArg: number }
): ArgsType {
	const entityKind = args[ position.kindArg ];
	const entityName = args[ position.nameArg ];

	if ( ! entityKind || ! entityName ) {
		return args;
	}

	const alternative =
		deprecatedEntities[ entityKind ]?.[ entityName ]?.alternative;

	if ( alternative ) {
		// Create a new tuple with the same type as Args
		const newArgs = args.map( ( value, index ) => {
			if ( index === position.kindArg ) {
				return alternative.kind;
			}
			if ( index === position.nameArg ) {
				return alternative.name;
			}
			return value;
		} ) as ArgsType;

		deprecated( `${ functionName }( ${ args.join( ', ' ) } )`, {
			since: '11.3',
			alternative: `${ functionName }( ${ newArgs.join( ', ' ) } )`,
		} );

		return newArgs;
	}

	return args;
}
