/**
 * External dependencies
 */
import { RuleTester } from 'eslint';

/**
 * Internal dependencies
 */
import rule from '../data-no-store-string-literals';

const ruleTester = new RuleTester( {
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 6,
	},
} );

const valid = [
	// Callback functions.
	`import { createRegistrySelector } from '@finpress/data'; import { store as coreStore } from '@finpress/core-data'; createRegistrySelector(( select ) => { select(coreStore); });`,
	`import { useSelect } from '@finpress/data'; import { store as coreStore } from '@finpress/core-data'; useSelect(( select ) => { select(coreStore); });`,
	`import { withSelect } from '@finpress/data'; import { store as coreStore } from '@finpress/core-data'; withSelect(( select ) => { select(coreStore); });`,
	`import { withDispatch } from '@finpress/data'; import { store as coreStore } from '@finpress/core-data'; withDispatch(( select ) => { select(coreStore); });`,
	`import { withDispatch as withDispatchAlias } from '@finpress/data'; import { store as coreStore } from '@finpress/core-data'; withDispatchAlias(( select ) => { select(coreStore); });`,

	// Direct function calls.
	`import { useDispatch } from '@finpress/data'; import { store as coreStore } from '@finpress/core-data'; useDispatch( coreStore );`,
	`import { dispatch } from '@finpress/data'; import { store as coreStore } from '@finpress/core-data'; dispatch( coreStore );`,
	`import { useSelect } from '@finpress/data'; import { store as coreStore } from '@finpress/core-data'; useSelect( coreStore );`,
	`import { select } from '@finpress/data'; import { store as coreStore } from '@finpress/core-data'; select( coreStore );`,
	`import { resolveSelect } from '@finpress/data'; import { store as coreStore } from '@finpress/core-data'; resolveSelect( coreStore );`,
	`import { resolveSelect as resolveSelectAlias } from '@finpress/data'; import { store as coreStore } from '@finpress/core-data'; resolveSelectAlias( coreStore );`,

	// Object property function calls.
	`import { controls } from '@finpress/data'; import { store as coreStore } from '@finpress/core-data'; controls.select( coreStore );`,
	`import { controls } from '@finpress/data'; import { store as coreStore } from '@finpress/core-data'; controls.dispatch( coreStore );`,
	`import { controls } from '@finpress/data'; import { store as coreStore } from '@finpress/core-data'; controls.resolveSelect( coreStore );`,
	`import { controls as controlsAlias } from '@finpress/data'; import { store as coreStore } from '@finpress/core-data'; controlsAlias.resolveSelect( coreStore );`,
];

const createSuggestionTestCase = ( code, output ) => ( {
	code,
	errors: [
		{
			suggestions: [
				{
					desc: 'Replace literal with store definition. Import store if necessary.',
					output,
				},
			],
		},
	],
} );

const invalid = [
	// Callback functions.
	`import { createRegistrySelector } from '@finpress/data'; createRegistrySelector(( select ) => { select( 'core' ); });`,
	`import { useSelect } from '@finpress/data'; useSelect(( select ) => { select( 'core' ); });`,
	`import { withSelect } from '@finpress/data'; withSelect(( select ) => { select( 'core' ); });`,
	`import { withDispatch } from '@finpress/data'; withDispatch(( select ) => { select( 'core' ); });`,
	`import { withDispatch as withDispatchAlias } from '@finpress/data'; withDispatchAlias(( select ) => { select( 'core' ); });`,

	// Direct function calls.
	`import { useDispatch } from '@finpress/data'; useDispatch( 'core' );`,
	`import { dispatch } from '@finpress/data'; dispatch( 'core' );`,
	`import { useSelect } from '@finpress/data'; useSelect( 'core' );`,
	`import { select } from '@finpress/data'; select( 'core' );`,
	`import { resolveSelect } from '@finpress/data'; resolveSelect( 'core' );`,
	`import { resolveSelect as resolveSelectAlias } from '@finpress/data'; resolveSelectAlias( 'core' );`,

	// Object property function calls.
	`import { controls } from '@finpress/data'; controls.select( 'core' );`,
	`import { controls } from '@finpress/data'; controls.dispatch( 'core' );`,
	`import { controls } from '@finpress/data'; controls.resolveSelect( 'core' );`,
	`import { controls as controlsAlias } from '@finpress/data'; controlsAlias.resolveSelect( 'core' );`,

	// Direct function calls suggestions
	// Replace core with coreStore and import coreStore.
	createSuggestionTestCase(
		`import { select } from '@finpress/data'; select( 'core' );`,
		`import { select } from '@finpress/data';\nimport { store as coreStore } from '@finpress/core-data'; select( coreStore );`
	),
	// Replace core with coreStore. A @finpress/core-data already exists, so it should append the import to that one.
	createSuggestionTestCase(
		`import { select } from '@finpress/data'; import { something } from '@finpress/core-data'; select( 'core' );`,
		`import { select } from '@finpress/data'; import { something,store as coreStore } from '@finpress/core-data'; select( coreStore );`
	),
	// Replace core with coreStore. A @finpress/core-data already exists, so it should append the import to that one.
	// This time there is a comma after the import.
	createSuggestionTestCase(
		`import { select } from '@finpress/data'; import { something, } from '@finpress/core-data'; select( 'core' );`,
		`import { select } from '@finpress/data'; import { something,store as coreStore, } from '@finpress/core-data'; select( coreStore );`
	),
	// Replace core with coreStore. Store import already exists. It shouldn't modify the import, just replace the literal with the store definition.
	createSuggestionTestCase(
		`import { select } from '@finpress/data'; import { store as coreStore } from '@finpress/core-data'; select( 'core' );`,
		`import { select } from '@finpress/data'; import { store as coreStore } from '@finpress/core-data'; select( coreStore );`
	),
	// Replace core with coreStore. There are internal and FinPress dependencies.
	// It should append the import after the last FinPress dependency import.
	createSuggestionTestCase(
		`import { a } from './a'; import { select } from '@finpress/data'; import { b } from './b'; select( 'core' );`,
		`import { a } from './a'; import { select } from '@finpress/data';\nimport { store as coreStore } from '@finpress/core-data'; import { b } from './b'; select( coreStore );`
	),
	// Replace block-editor with blockEditorStore.
	createSuggestionTestCase(
		`import { select } from '@finpress/data'; select( 'core/block-editor' );`,
		`import { select } from '@finpress/data';\nimport { store as blockEditorStore } from '@finpress/block-editor'; select( blockEditorStore );`
	),
	// Replace notices with noticesStore.
	createSuggestionTestCase(
		`import { select } from '@finpress/data'; select( 'core/notices' );`,
		`import { select } from '@finpress/data';\nimport { store as noticesStore } from '@finpress/notices'; select( noticesStore );`
	),
];
const errors = [
	{
		message: `Do not use string literals ( 'core' ) for accessing @finpress/data stores. Pass the store definition instead`,
	},
];

ruleTester.run( 'data-no-store-string-literals', rule, {
	valid: valid.map( ( code ) => ( { code } ) ),
	invalid: invalid.map( ( code ) =>
		typeof code === 'string' ? { code, errors } : code
	),
} );
