/**
 * Return type for string translation functions.
 *
 * Used for type checking of sprintf().
 */
export type TranslatableText< T extends string > = string & {
	readonly __translatableText: T;
};
