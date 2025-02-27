/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * Reducer returning the registered shortcuts
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
function registeredShortcuts( state = {}, action ) {
	switch ( action.type ) {
		case 'REGISTER_SHORTCUT':
			return {
				...state,
				[ action.name ]: {
					category: action.category,
					keyCombination: action.keyCombination,
					aliases: action.aliases,
					description: action.description,
				},
			};
		case 'UNREGISTER_SHORTCUT':
			const { [ action.name ]: actionName, ...remainingState } = state;
			return remainingState;
	}

	return state;
}

/**
 * Reducer returning whether shortcuts are enabled.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {boolean} Updated state.
 */
function shortcutsEnabled( state = true, action ) {
	switch ( action.type ) {
		case 'TOGGLE_SHORTCUTS_ENABLED':
			return action.areShortcutsEnabled;
	}

	return state;
}

export default combineReducers( {
	registeredShortcuts,
	shortcutsEnabled,
} );
