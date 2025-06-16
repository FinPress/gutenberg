export type TranslatableText< T extends string > = string & {
	readonly __translatableText: T;
};
