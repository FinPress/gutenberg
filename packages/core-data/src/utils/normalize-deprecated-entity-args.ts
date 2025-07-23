/**
 * WordPress dependencies
 */
import deprecated from '@wordpress/deprecated';

/**
 * Internal dependencies
 */
import { deprecatedEntities } from '../entities';

/**
 * Normalize deprecated entity arguments.
 *
 * This is a curried version of `normalizeDeprecatedEntityArgs` that
 * returns a function that takes the arguments and returns the normalized
 * arguments.
 *
 * @param functionName     The name of the function to normalize.
 * @param position         The index of the kind and name in the arguments.
 * @param position.kindArg The index of the kind in the arguments.
 * @param position.nameArg The index of the name in the arguments.
 *
 * @return A function that takes the arguments and returns the normalized arguments.
 */
export default function normalizeForDeprecatedEntities<
	ArgsType extends any[],
>(
	functionName: string,
	position: { kindArg: number; nameArg: number } = {
		kindArg: 0,
		nameArg: 1,
	}
): ( args: ArgsType ) => ArgsType {
	// Return a function that only takes arguments for ease of use with `__unstableNormalizeArgs`.
	return ( args: ArgsType ) => {
		const entityKind = args[ position.kindArg ];
		const entityName = args[ position.nameArg ];

		if ( ! entityKind || ! entityName ) {
			return args;
		}

		const alternative =
			deprecatedEntities[ entityKind ]?.[ entityName ]?.alternative;

		if ( alternative ) {
			// Create a new tuple with the same type as Args.
			const newArgs = args.map( ( value, index ) => {
				if ( index === position.kindArg ) {
					return alternative.kind;
				}
				if ( index === position.nameArg ) {
					return alternative.name;
				}
				return value;
			} ) as ArgsType;

			deprecated(
				`Using '${ functionName }' with the '${ entityKind }', '${ entityName }' entity`,
				{
					since: alternative.version,
					alternative: `'${ functionName }' with the '${ alternative.kind }', '${ alternative.name }' entity`,
				}
			);

			return newArgs;
		}

		return args;
	};
}
