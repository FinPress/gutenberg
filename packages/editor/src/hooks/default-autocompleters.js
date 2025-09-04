/**
 * FinPress dependencies
 */
import { addFilter } from '@finpress/hooks';

/**
 * Internal dependencies
 */
import { userAutocompleter } from '../components';

function setDefaultCompleters( completers = [] ) {
	// Provide copies so filters may directly modify them.
	completers.push( { ...userAutocompleter } );

	return completers;
}

addFilter(
	'editor.Autocomplete.completers',
	'editor/autocompleters/set-default-completers',
	setDefaultCompleters
);
