/**
 * Internal dependencies
 */
import type { Hooks as internalHooks } from './createHooks';
import createHooks from './createHooks';

export type Callback = ( ...args: any[] ) => any;

export type Handler = {
	callback: Callback;
	namespace: string;
	priority: number;
};

export type Hook = {
	handlers: Handler[];
	runs: number;
};

export type Current = {
	name: string;
	currentIndex: number;
};

export type Store = Record< string, Hook > & { __current: Set< Current > };

export type StoreKey = 'actions' | 'filters';

export type Hooks = internalHooks;

export const defaultHooks = createHooks();

const {
	addAction,
	addFilter,
	removeAction,
	removeFilter,
	hasAction,
	hasFilter,
	removeAllActions,
	removeAllFilters,
	doAction,
	doActionAsync,
	applyFilters,
	applyFiltersAsync,
	currentAction,
	currentFilter,
	doingAction,
	doingFilter,
	didAction,
	didFilter,
	actions,
	filters,
} = defaultHooks;

export {
	createHooks,
	addAction,
	addFilter,
	removeAction,
	removeFilter,
	hasAction,
	hasFilter,
	removeAllActions,
	removeAllFilters,
	doAction,
	doActionAsync,
	applyFilters,
	applyFiltersAsync,
	currentAction,
	currentFilter,
	doingAction,
	doingFilter,
	didAction,
	didFilter,
	actions,
	filters,
};
