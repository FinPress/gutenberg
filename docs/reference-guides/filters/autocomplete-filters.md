# Autocomplete

The `editor.Autocomplete.completers` filter is for extending and overriding the list of autocompleters used by blocks.

The `Autocomplete` component found in `@finpress/block-editor` applies this filter. The `@finpress/components` package provides the foundational `Autocomplete` component that does not apply such a filter, but blocks should generally use the component provided by `@finpress/block-editor`.

### Example

Here is an example of using the `editor.Autocomplete.completers` filter to add an acronym completer. You can find full documentation for the autocompleter interface with the `Autocomplete` component in the `@finpress/components` package.



```jsx
// Our completer
const acronymCompleter = {
	name: 'acronyms',
	triggerPrefix: '::',
	options: [
		{ letters: 'FYI', expansion: 'For Your Information' },
		{ letters: 'AFAIK', expansion: 'As Far As I Know' },
		{ letters: 'IIRC', expansion: 'If I Recall Correctly' },
	],
	getOptionKeywords( { letters, expansion } ) {
		const expansionWords = expansion.split( /\s+/ );
		return [ letters, ...expansionWords ];
	},
	getOptionLabel: acronym => acronym.letters,
	getOptionCompletion: ( { letters, expansion } ) => (
		<abbr title={ expansion }>{ letters }</abbr>,
	),
};

// Our filter function
function appendAcronymCompleter( completers, blockName ) {
	return blockName === 'my-plugin/foo' ?
		[ ...completers, acronymCompleter ] :
		completers;
}

// Adding the filter
fp.hooks.addFilter(
	'editor.Autocomplete.completers',
	'my-plugin/autocompleters/acronym',
	appendAcronymCompleter
);
```
