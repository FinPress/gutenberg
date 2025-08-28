/**
 * External dependencies
 */
import removeAccents from 'remove-accents';

/**
 * WordPress dependencies
 */
import { slice, getTextContent } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import { getAutoCompleterUI } from './autocompleter-ui';
import { escapeRegExp } from '../utils/strings';
import type {
	AutocompleterUIProps,
	WPCompleter,
	UseAutocompleteProps,
} from './types';

export interface AutocompleterMatchResult {
	/** The matched completer, or null if no match */
	completer: WPCompleter | null;
	/** The filter value/query extracted from the text */
	filterValue: string;
	/** Whether the autocompleter should be reset */
	shouldReset: boolean;
	/** The AutocompleterUI component to use */
	AutocompleterUI:
		| ( ( props: AutocompleterUIProps ) => JSX.Element | null )
		| null;
}

export interface AutocompleterMatchOptions {
	/** The text content to match against */
	textContent: string;
	/** Array of available completers */
	completers: WPCompleter[];
	/** Length of currently filtered options (used to detect mismatch) */
	currentFilteredOptionsLength: number;
	/** Whether the user is currently backspacing */
	isBackspacing: boolean;
	/** The currently active autocompleter */
	currentAutocompleter: WPCompleter | null;
	/** The current AutocompleterUI component */
	currentAutocompleterUI:
		| ( ( props: AutocompleterUIProps ) => JSX.Element | null )
		| null;
	/** The record object for context checking */
	record: UseAutocompleteProps[ 'record' ];
}

/**
 * Matches text content against available completers and determines the appropriate
 * autocompleter state. This function contains the core matching logic extracted
 * from the useAutocomplete hook for better testability.
 *
 * @param options The matching options
 * @return The matching result containing completer info and state updates
 */
export function matchAutocompleters(
	options: AutocompleterMatchOptions
): AutocompleterMatchResult {
	const {
		textContent,
		completers,
		currentFilteredOptionsLength,
		isBackspacing,
		currentAutocompleter,
		currentAutocompleterUI,
		record,
	} = options;

	// If no text content, reset
	if ( ! textContent ) {
		return {
			completer: null,
			filterValue: '',
			shouldReset: true,
			AutocompleterUI: null,
		};
	}

	// Find the completer with the highest triggerPrefix index in the textContent
	const completer = completers.reduce< WPCompleter | null >(
		( lastTrigger, currentCompleter ) => {
			const triggerIndex = textContent.lastIndexOf(
				currentCompleter.triggerPrefix
			);
			const lastTriggerIndex =
				lastTrigger !== null
					? textContent.lastIndexOf( lastTrigger.triggerPrefix )
					: -1;

			return triggerIndex > lastTriggerIndex
				? currentCompleter
				: lastTrigger;
		},
		null
	);

	// If no completer found, reset
	if ( ! completer ) {
		return {
			completer: null,
			filterValue: '',
			shouldReset: true,
			AutocompleterUI: null,
		};
	}

	const { allowContext, triggerPrefix } = completer;
	const triggerIndex = textContent.lastIndexOf( triggerPrefix );
	const textWithoutTrigger = textContent.slice(
		triggerIndex + triggerPrefix.length
	);

	// Performance guard: prevent matching if too far from trigger
	const tooDistantFromTrigger = textWithoutTrigger.length > 50;
	if ( tooDistantFromTrigger ) {
		return {
			completer: null,
			filterValue: '',
			shouldReset: false, // Don't reset, just ignore this match attempt
			AutocompleterUI: null,
		};
	}

	const mismatch = currentFilteredOptionsLength === 0;
	const wordsFromTrigger = textWithoutTrigger.split( /\s/ );

	// Allow the effect to run when not backspacing and if there was a mismatch
	// i.e when typing a trigger + the match string or when clicking in an
	// existing trigger word on the page
	const hasOneTriggerWord = wordsFromTrigger.length === 1;

	// Allow the effect to run when backspacing and if "touching" a word that
	// "belongs" to a trigger. We consider a "trigger word" any word up to the
	// limit of 3 from the trigger character
	const matchingWhileBackspacing =
		isBackspacing && wordsFromTrigger.length <= 3;

	// If there's a mismatch and we're not in a valid backspacing or single word scenario
	if ( mismatch && ! ( matchingWhileBackspacing || hasOneTriggerWord ) ) {
		return {
			completer: null,
			filterValue: '',
			shouldReset: true,
			AutocompleterUI: null,
		};
	}

	// Check context constraints if allowContext is defined
	if ( allowContext ) {
		const textAfterSelection = getTextContent(
			slice( record, undefined, getTextContent( record ).length )
		);

		if (
			! allowContext(
				textContent.slice( 0, triggerIndex ),
				textAfterSelection
			)
		) {
			return {
				completer: null,
				filterValue: '',
				shouldReset: true,
				AutocompleterUI: null,
			};
		}
	}

	// Validate text format - reject if starts or ends with problematic whitespace
	if (
		/^\s/.test( textWithoutTrigger ) ||
		/\s\s+$/.test( textWithoutTrigger )
	) {
		return {
			completer: null,
			filterValue: '',
			shouldReset: true,
			AutocompleterUI: null,
		};
	}

	// Validate character range
	if ( ! /[\u0000-\uFFFF]*$/.test( textWithoutTrigger ) ) {
		return {
			completer: null,
			filterValue: '',
			shouldReset: true,
			AutocompleterUI: null,
		};
	}

	// Extract the query from the text
	const safeTrigger = escapeRegExp( completer.triggerPrefix );
	const text = removeAccents( textContent );
	const match = text
		.slice( text.lastIndexOf( completer.triggerPrefix ) )
		.match( new RegExp( `${ safeTrigger }([\u0000-\uFFFF]*)$` ) );
	const query = match && match[ 1 ];

	// Determine the AutocompleterUI to use
	const AutocompleterUI =
		completer !== currentAutocompleter
			? getAutoCompleterUI( completer )
			: currentAutocompleterUI;

	return {
		completer,
		filterValue: query === null ? '' : query,
		shouldReset: false,
		AutocompleterUI,
	};
}
