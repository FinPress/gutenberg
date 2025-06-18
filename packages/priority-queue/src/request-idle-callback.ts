/**
 * External dependencies
 */
import 'requestidlecallback';

/**
 * @param timeOrDeadline - IdleDeadline object or a timestamp number.
 */
export type RequestIdleCallbackCallback = (
	timeOrDeadline: IdleDeadline | number
) => void;

/**
 * @return A function that schedules a callback when the browser is idle or via setTimeout on the server.
 */
export function createRequestIdleCallback() {
	if ( typeof window === 'undefined' ) {
		return ( callback: RequestIdleCallbackCallback ) => {
			setTimeout( () => callback( Date.now() ), 0 );
		};
	}

	return window.requestIdleCallback;
}

export default createRequestIdleCallback();
