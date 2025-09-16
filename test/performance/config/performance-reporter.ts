/**
 * External dependencies
 */
import path from 'path';
import { writeFileSync } from 'fs';
import type {
	Reporter,
	FullResult,
	TestCase,
	TestResult,
} from '@playwright/test/reporter';

/**
 * Internal dependencies
 */
import { stats, round } from '../utils';

export interface FPRawPerformanceResults {
	timeToFirstByte: number[];
	largestContentfulPaint: number[];
	lcpMinusTtfb: number[];
	serverResponse: number[];
	firstPaint: number[];
	domContentLoaded: number[];
	loaded: number[];
	firstContentfulPaint: number[];
	firstBlock: number[];
	type: number[];
	typeWithoutInspector: number[];
	typeWithTopToolbar: number[];
	typeContainer: number[];
	focus: number[];
	inserterOpen: number[];
	inserterSearch: number[];
	inserterHover: number[];
	loadPatterns: number[];
	loadPages: number[];
	listViewOpen: number[];
	navigate: number[];
	finBeforeTemplate: number[];
	finTemplate: number[];
	finTotal: number[];
	finMemoryUsage: number[];
	finDbQueries: number[];
}

type PerformanceStats = {
	q25: number;
	q50: number;
	q75: number;
	cnt: number; // number of data points
};

export interface FPPerformanceResults {
	timeToFirstByte?: PerformanceStats;
	largestContentfulPaint?: PerformanceStats;
	lcpMinusTtfb?: PerformanceStats;
	serverResponse?: PerformanceStats;
	firstPaint?: PerformanceStats;
	domContentLoaded?: PerformanceStats;
	loaded?: PerformanceStats;
	firstContentfulPaint?: PerformanceStats;
	firstBlock?: PerformanceStats;
	type?: PerformanceStats;
	typeWithoutInspector?: PerformanceStats;
	typeWithTopToolbar?: PerformanceStats;
	typeContainer?: PerformanceStats;
	focus?: PerformanceStats;
	inserterOpen?: PerformanceStats;
	inserterSearch?: PerformanceStats;
	inserterHover?: PerformanceStats;
	loadPatterns?: PerformanceStats;
	loadPages?: PerformanceStats;
	listViewOpen?: PerformanceStats;
	navigate?: PerformanceStats;
	finBeforeTemplate?: PerformanceStats;
	finTemplate?: PerformanceStats;
	finTotal?: PerformanceStats;
	finMemoryUsage?: PerformanceStats;
	finDbQueries?: PerformanceStats;
}

/**
 * Curate the raw performance results.
 *
 * @param results Raw results.
 * @return Curated statistics for the results.
 */
export function curateResults(
	results: FPRawPerformanceResults
): FPPerformanceResults {
	const output = {
		timeToFirstByte: stats( results.timeToFirstByte ),
		largestContentfulPaint: stats( results.largestContentfulPaint ),
		lcpMinusTtfb: stats( results.lcpMinusTtfb ),
		serverResponse: stats( results.serverResponse ),
		firstPaint: stats( results.firstPaint ),
		domContentLoaded: stats( results.domContentLoaded ),
		loaded: stats( results.loaded ),
		firstContentfulPaint: stats( results.firstContentfulPaint ),
		firstBlock: stats( results.firstBlock ),
		type: stats( results.type ),
		typeWithoutInspector: stats( results.typeWithoutInspector ),
		typeWithTopToolbar: stats( results.typeWithTopToolbar ),
		typeContainer: stats( results.typeContainer ),
		focus: stats( results.focus ),
		inserterOpen: stats( results.inserterOpen ),
		inserterSearch: stats( results.inserterSearch ),
		inserterHover: stats( results.inserterHover ),
		loadPatterns: stats( results.loadPatterns ),
		loadPages: stats( results.loadPages ),
		listViewOpen: stats( results.listViewOpen ),
		navigate: stats( results.navigate ),
		finBeforeTemplate: stats( results.finBeforeTemplate ),
		finTemplate: stats( results.finTemplate ),
		finTotal: stats( results.finTotal ),
		finMemoryUsage: stats( results.finMemoryUsage ),
		finDbQueries: stats( results.finDbQueries ),
	};

	return Object.fromEntries(
		Object.entries( output )
			// Reduce the output to contain taken metrics only.
			.filter( ( [ , value ] ) => value !== undefined )
	);
}

function formatValue( metric: string, value: number ) {
	if ( 'finMemoryUsage' === metric ) {
		return `${ ( value / Math.pow( 10, 6 ) ).toFixed( 2 ) } MB`;
	}

	if ( 'finDbQueries' === metric ) {
		return value.toString();
	}

	return `${ value } ms`;
}

class PerformanceReporter implements Reporter {
	private results: Record< string, FPPerformanceResults >;

	constructor() {
		this.results = {};
	}

	onTestEnd( test: TestCase, result: TestResult ): void {
		for ( const attachment of result.attachments ) {
			if ( attachment.name !== 'results' ) {
				continue;
			}

			if ( ! attachment.body ) {
				throw new Error( 'Empty results attachment' );
			}

			const testSuite = path.basename( test.location.file, '.spec.js' );
			const resultsId = process.env.RESULTS_ID || testSuite;
			const resultsPath = process.env.FP_ARTIFACTS_PATH as string;
			const resultsBody = attachment.body.toString();

			// Save raw results to file.
			writeFileSync(
				path.join(
					resultsPath,
					`${ resultsId }.performance-results.raw.json`
				),
				resultsBody
			);

			const curatedResults = curateResults( JSON.parse( resultsBody ) );

			// Save curated results to file.
			writeFileSync(
				path.join(
					resultsPath,
					`${ resultsId }.performance-results.json`
				),
				JSON.stringify( curatedResults, null, 2 )
			);

			this.results[ testSuite ] = curatedResults;
		}
	}

	onEnd( result: FullResult ) {
		if ( result.status !== 'passed' ) {
			return;
		}

		if ( process.env.CI ) {
			return;
		}

		// Print the results.
		for ( const [ testSuite, results ] of Object.entries( this.results ) ) {
			const printableResults: Record< string, { value: string } > = {};

			for ( const [ metric, value ] of Object.entries( results ) ) {
				const valueStr = formatValue( metric, value.q50 );
				const pp = round(
					( 100 * ( value.q75 - value.q50 ) ) / value.q50
				);
				const mp = round(
					( 100 * ( value.q50 - value.q25 ) ) / value.q50
				);
				printableResults[ metric ] = {
					value: `${ valueStr } +${ pp }% -${ mp }%`,
				};
			}

			// eslint-disable-next-line no-console
			console.log( `\n${ testSuite }\n` );
			// eslint-disable-next-line no-console
			console.table( printableResults );
		}
	}

	printsToStdio() {
		return true;
	}

	onStdOut( chunk: string | Buffer ) {
		process.stdout.write( chunk );
	}

	onStdErr( chunk: string | Buffer ) {
		process.stderr.write( chunk );
	}
}

export default PerformanceReporter;
