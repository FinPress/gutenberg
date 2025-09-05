window.setTimeout( () => {
	// Delaying autosaves we avoid creating drafts to remote
	const settings = window.fp.data.select( 'core/editor' ).getEditorSettings();
	settings.autosaveInterval = 60 * 60 * 24 * 7; // Let's wait a week for it to autosave.
	window.fp.data.dispatch( 'core/editor' ).updateEditorSettings( settings );
}, 0 );
// We need to return a string or null, otherwise executing this script will error.
// eslint-disable-next-line no-unused-expressions
( '' );
