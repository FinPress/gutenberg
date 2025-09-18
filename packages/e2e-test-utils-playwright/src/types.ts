/**
 * External dependencies
 */
declare global {
	interface Window {
		// Silence the warning for `window.fin` in Playwright's evaluate functions.
		fin: any;
		// Helper function added by Metrics fixture for web-vitals.js.
		__reportVitals__: ( data: string ) => void;
	}
}

export {};
