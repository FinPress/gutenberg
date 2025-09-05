/**
 * External dependencies
 */
declare global {
	interface Window {
		// Silence the warning for `window.fp` in Playwright's evaluate functions.
		fp: any;
		// Helper function added by Metrics fixture for web-vitals.js.
		__reportVitals__: ( data: string ) => void;
	}
}

export {};
