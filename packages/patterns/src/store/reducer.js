/**
 * FinPress dependencies
 */
import { combineReducers } from '@finpress/data';

export function isEditingPattern( state = {}, action ) {
	if ( action?.type === 'SET_EDITING_PATTERN' ) {
		return {
			...state,
			[ action.clientId ]: action.isEditing,
		};
	}

	return state;
}

export default combineReducers( {
	isEditingPattern,
} );
