// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
/**
 * External dependencies
 */
const Benchmark = require( 'benchmark' );

/**
 * Internal dependencies
 */
const { matchAutocompleters } = require( '../autocompleter-matcher' );

const suite = new Benchmark.Suite();

/**
 * Helper to create a mock completer
 *
 * @param {string}        name
 * @param {string}        triggerPrefix
 * @param {Function|null} allowContext
 * @return {Object} Mock completer object
 */
const createMockCompleter = ( name, triggerPrefix, allowContext = null ) => ( {
	name,
	triggerPrefix,
	allowContext,
	/**
	 * Function to get the label of an option
	 *
	 * @param {Object} option
	 * @param {string} option.label
	 * @return {string} Label of the option
	 */
	getOptionLabel: ( option ) => option.label,
	options: [
		{ label: 'Option 1', value: 'opt1' },
		{ label: 'Option 2', value: 'opt2' },
		{ label: 'Option 3', value: 'opt3' },
	],
} );

const mockCompleters = [
	createMockCompleter( 'slash', '/' ),
	createMockCompleter( 'at', '@' ),
	createMockCompleter( 'hash', '#' ),
	createMockCompleter( 'dollar', '$' ),
];

const mockRecord = {
	text: 'Hello world',
	formats: [],
	replacements: [],
	start: 11,
	end: 11,
};

// Test scenarios
const scenarios = {
	'no match': {
		textContent: 'Hello world',
		completers: mockCompleters,
		currentFilteredOptionsLength: 0,
		isBackspacing: false,
		currentAutocompleter: null,
		currentAutocompleterUI: null,
		record: mockRecord,
	},
	'simple match': {
		textContent: 'Hello /test',
		completers: mockCompleters,
		currentFilteredOptionsLength: 3,
		isBackspacing: false,
		currentAutocompleter: null,
		currentAutocompleterUI: null,
		record: mockRecord,
	},
	'multiple triggers': {
		textContent: 'Hello @user /block',
		completers: mockCompleters,
		currentFilteredOptionsLength: 2,
		isBackspacing: false,
		currentAutocompleter: null,
		currentAutocompleterUI: null,
		record: mockRecord,
	},
	'backspacing scenario': {
		textContent: 'Hello /test word another',
		completers: mockCompleters,
		currentFilteredOptionsLength: 0,
		isBackspacing: true,
		currentAutocompleter: mockCompleters[ 0 ],
		currentAutocompleterUI: () => null,
		record: mockRecord,
	},
	'context validation': {
		textContent: 'Hello /test',
		completers: [
			createMockCompleter( 'contextual', '/', ( before, after ) => {
				return before.includes( 'Hello' ) && after.length === 0;
			} ),
		],
		currentFilteredOptionsLength: 1,
		isBackspacing: false,
		currentAutocompleter: null,
		currentAutocompleterUI: null,
		record: mockRecord,
	},
	'long text': {
		textContent: 'A'.repeat( 100 ) + '/test',
		completers: mockCompleters,
		currentFilteredOptionsLength: 2,
		isBackspacing: false,
		currentAutocompleter: null,
		currentAutocompleterUI: null,
		record: mockRecord,
	},
	'empty text': {
		textContent: '',
		completers: mockCompleters,
		currentFilteredOptionsLength: 0,
		isBackspacing: false,
		currentAutocompleter: null,
		currentAutocompleterUI: null,
		record: mockRecord,
	},
	'whitespace edge cases': {
		textContent: 'Hello / test',
		completers: mockCompleters,
		currentFilteredOptionsLength: 0,
		isBackspacing: false,
		currentAutocompleter: null,
		currentAutocompleterUI: null,
		record: mockRecord,
	},
	'distant trigger': {
		textContent: 'Hello /test ' + 'word '.repeat( 20 ),
		completers: mockCompleters,
		currentFilteredOptionsLength: 0,
		isBackspacing: false,
		currentAutocompleter: null,
		currentAutocompleterUI: null,
		record: mockRecord,
	},
	'many completers': {
		textContent: 'Hello /test',
		completers: [
			...mockCompleters,
			...Array.from( { length: 20 }, ( _, i ) =>
				createMockCompleter( `completer${ i }`, `!${ i }` )
			),
		],
		currentFilteredOptionsLength: 5,
		isBackspacing: false,
		currentAutocompleter: null,
		currentAutocompleterUI: null,
		record: mockRecord,
	},
};

// Add benchmarks for each scenario
Object.entries( scenarios ).forEach( ( [ name, options ] ) => {
	suite.add( `matchAutocompleters - ${ name }`, () => {
		matchAutocompleters( options );
	} );
} );

// Stress test scenarios
const stressTestScenarios = {
	'stress - many triggers in text': {
		textContent: Array.from( { length: 50 }, ( _, i ) => `/${ i }` ).join(
			' '
		),
		completers: mockCompleters,
		currentFilteredOptionsLength: 10,
		isBackspacing: false,
		currentAutocompleter: null,
		currentAutocompleterUI: null,
		record: mockRecord,
	},
	'stress - large completers array': {
		textContent: 'Hello /test',
		completers: Array.from( { length: 100 }, ( _, i ) =>
			createMockCompleter( `stress${ i }`, `/${ i }` )
		),
		currentFilteredOptionsLength: 50,
		isBackspacing: false,
		currentAutocompleter: null,
		currentAutocompleterUI: null,
		record: mockRecord,
	},
	'stress - very long query': {
		textContent: 'Hello /' + 'a'.repeat( 1000 ),
		completers: mockCompleters,
		currentFilteredOptionsLength: 1,
		isBackspacing: false,
		currentAutocompleter: null,
		currentAutocompleterUI: null,
		record: mockRecord,
	},
};

// Add stress test benchmarks
Object.entries( stressTestScenarios ).forEach( ( [ name, options ] ) => {
	suite.add( `${ name }`, () => {
		matchAutocompleters( options );
	} );
} );

// Performance comparison tests
const performanceComparisons = {
	'comparison - cached vs new completer': [
		{
			name: 'cached completer',
			options: {
				textContent: 'Hello /test',
				completers: mockCompleters,
				currentFilteredOptionsLength: 3,
				isBackspacing: false,
				currentAutocompleter: mockCompleters[ 0 ],
				currentAutocompleterUI: () => null,
				record: mockRecord,
			},
		},
		{
			name: 'new completer',
			options: {
				textContent: 'Hello /test',
				completers: mockCompleters,
				currentFilteredOptionsLength: 3,
				isBackspacing: false,
				currentAutocompleter: null,
				currentAutocompleterUI: null,
				record: mockRecord,
			},
		},
	],
	'comparison - with vs without context': [
		{
			name: 'without context validation',
			options: {
				textContent: 'Hello /test',
				completers: [ createMockCompleter( 'simple', '/' ) ],
				currentFilteredOptionsLength: 1,
				isBackspacing: false,
				currentAutocompleter: null,
				currentAutocompleterUI: null,
				record: mockRecord,
			},
		},
		{
			name: 'with context validation',
			options: {
				textContent: 'Hello /test',
				completers: [
					createMockCompleter( 'contextual', '/', ( before ) =>
						before.startsWith( 'Hello' )
					),
				],
				currentFilteredOptionsLength: 1,
				isBackspacing: false,
				currentAutocompleter: null,
				currentAutocompleterUI: null,
				record: mockRecord,
			},
		},
	],
};

// Add performance comparison benchmarks
Object.entries( performanceComparisons ).forEach(
	( [ comparisonName, tests ] ) => {
		tests.forEach( ( test ) => {
			suite.add( `${ comparisonName } - ${ test.name }`, () => {
				matchAutocompleters( test.options );
			} );
		} );
	}
);

// Configure suite
const filter = process.argv[ 2 ];
const isInFilter = ( testName ) => ! filter || testName.includes( filter );

// Run the benchmarks
suite
	.on( 'start', () => {
		console.log( 'Starting autocompleter-matcher benchmarks...\n' );
		if ( filter ) {
			console.log( `Filter: ${ filter }\n` );
		}
	} )
	.on( 'cycle', ( event ) => {
		const benchmark = event.target;
		if ( isInFilter( benchmark.name ) ) {
			console.log( benchmark.toString() );
		}
	} )
	.on( 'complete', () => {
		console.log( '\nBenchmark complete!' );

		// Find fastest and slowest
		const filtered = suite.filter( ( benchmark ) =>
			isInFilter( benchmark.name )
		);

		if ( filtered.length > 1 ) {
			const fastest = filtered.filter( 'fastest' );
			const slowest = filtered.filter( 'slowest' );

			console.log( '\nResults Summary:' );
			console.log( `Fastest: ${ fastest.map( 'name' ).join( ', ' ) }` );
			console.log( `Slowest: ${ slowest.map( 'name' ).join( ', ' ) }` );

			// Calculate performance ratios
			if ( fastest.length === 1 && slowest.length === 1 ) {
				const fastestBench = fastest[ 0 ];
				const slowestBench = slowest[ 0 ];
				const ratio = ( slowestBench.hz / fastestBench.hz ).toFixed(
					2
				);
				console.log( `Performance ratio: ${ ratio }x` );
			}
		}
	} )
	.run( { async: true } );
