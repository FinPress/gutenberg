/**
 * External dependencies
 */
import _sprintf from '@tannin/sprintf';
import type { SprintfArgs } from '@tannin/sprintf/types';

/**
 * Internal dependencies
 */
import type { TranslatableText } from './types';

export function sprintf< T extends string >(
	format: T | TranslatableText< T >,
	...args: SprintfArgs< T >
): string;
export function sprintf< T extends string >(
	format: T | TranslatableText< T >,
	args: SprintfArgs< T >
): string;

/**
 * Returns a formatted string.
 *
 * @template {string} T
 * @param {T | TranslatableText<T>} format The format of the string to generate.
 * @param {SprintfArgs<T>}          args   Arguments to apply to the format.
 *
 * @see https://www.npmjs.com/package/@tannin/sprintf
 *
 * @return {string} The formatted string.
 */
export function sprintf< T extends string >(
	format: T | TranslatableText< T >,
	...args: SprintfArgs< T >
): string {
	return _sprintf( format as T, ...( args as SprintfArgs< T > ) );
}
