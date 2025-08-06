/**
 * External dependencies
 */
import { h, cloneElement, render } from 'preact';
import { batch } from '@preact/signals';

/**
 * Internal dependencies
 */
import registerDirectives from './directives';
import {
	initialVdom,
	hydrateRegions,
	getRegionRootFragment,
} from './hydration';
import { directivePrefix } from './constants';
import { toVdom } from './vdom';
import { directive } from './hooks';
import { getNamespace } from './namespaces';
import { parseServerData, populateServerData } from './store';
import { proxifyState } from './proxies';
import { postTask } from './utils';

export {
	store,
	getConfig,
	getServerState,
	type AsyncAction,
	type TypeYield,
} from './store';
export { getContext, getServerContext, getElement } from './scopes';
export {
	withScope,
	useWatch,
	useInit,
	useEffect,
	useLayoutEffect,
	useCallback,
	useMemo,
	splitTask,
	withSyncEvent,
} from './utils';

export { useState, useRef } from 'preact/hooks';

const requiredConsent =
	'I acknowledge that using private APIs means my theme or plugin will inevitably break in the next version of WordPress.';

export const privateApis = ( lock ): any => {
	if ( lock === requiredConsent ) {
		return {
			directivePrefix,
			getRegionRootFragment,
			initialVdom,
			toVdom,
			directive,
			getNamespace,
			h,
			cloneElement,
			render,
			proxifyState,
			parseServerData,
			populateServerData,
			batch,
		};
	}

	throw new Error( 'Forbidden access.' );
};

// Parse and populate the initial state and config.
// All the core directives are registered at this point as well.
populateServerData( parseServerData() );
registerDirectives();

// Defer hydration to the end of the task queue.
postTask( hydrateRegions );
