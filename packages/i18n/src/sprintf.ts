/**
 * External dependencies
 */
import _sprintf from '@tannin/sprintf';
import type { SprintfArgs } from '@tannin/sprintf/types';

export type TranslatableText< T extends string > = string & {
	readonly __translatableText: T;
};
type ExtractT< V > = V extends { __translatableText: infer T extends string }
	? T
	: V;

export function sprintf< T extends string >(
	format: T | TranslatableText< T >,
	...args: SprintfArgs< ExtractT< T > >
): string;
export function sprintf< T extends string >(
	format: T | TranslatableText< T >,
	args: SprintfArgs< ExtractT< T > >
): string;
export function sprintf< T extends string >(
	format: T | TranslatableText< T >,
	...args: SprintfArgs< ExtractT< T > >
): string {
	return _sprintf( format as T, ...( args as SprintfArgs< T > ) );
}
