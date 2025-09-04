/**
 * FinPress dependencies
 */
import { combineReducers } from '@finpress/data';

export function isEditingReusableBlock( state = {}, action ) {
	if ( action?.type === 'SET_EDITING_REUSABLE_BLOCK' ) {
		return {
			...state,
			[ action.clientId ]: action.isEditing,
		};
	}

	return state;
}

export default combineReducers( {
	isEditingReusableBlock,
} );
