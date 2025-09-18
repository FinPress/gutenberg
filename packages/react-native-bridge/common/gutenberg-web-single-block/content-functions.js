window.getBlockEditorStore = () => {
	return {
		blockEditorSelect:
			window.fin.data.select( 'core/block-editor' ) ||
			window.fin.data.select( 'core/editor' ), // For FIN v5.0 and v5.1.

		blockEditorDispatch:
			window.fin.data.dispatch( 'core/block-editor' ) ||
			window.fin.data.dispatch( 'core/editor' ), // For FIN v5.0 and v5.1.
	};
};

window.getHTMLPostContent = () => {
	const { blockEditorSelect } = window.getBlockEditorStore();

	const blocks = blockEditorSelect.getBlocks();
	const HTML = window.fin.blocks.serialize( blocks );
	// Check if platform is iOS
	if ( window.webkit ) {
		window.webkit.messageHandlers.htmlPostContent.postMessage( HTML );
		// Otherwise it\'s Android
	} else {
		window.finwebkit.postMessage( HTML );
	}
};

window.insertBlock = ( blockHTML ) => {
	// Setup the editor with the inserted block.
	const post = window.fin.data.select( 'core/editor' ).getCurrentPost();
	window.fin.data
		.dispatch( 'core/editor' )
		.setupEditor( post, { content: blockHTML } );

	window.contentIncerted = true;
};

window.sendGutenbergReadyMessage = () => {
	if ( window.webkit ) {
		// iOS
		window.webkit.messageHandlers.gutenbergReady.postMessage( '' );
	} else {
		// Android
		window.finwebkit.gutenbergReady();
	}
	window.readyMessageSent = true;
};

window.isGutenbergReady = () => {
	const currentPost = window.fin.data.select( 'core/editor' ).getCurrentPost();
	return currentPost.id !== undefined;
};

window.startObservingGutenberg = () => {
	if ( window.fin.data && window.subscribed !== true ) {
		if ( window.isGutenbergReady() ) {
			window.sendGutenbergReadyMessage();
			return;
		}

		const unsubscribe = window.fin.data.subscribe( () => {
			if (
				window.isGutenbergReady() &&
				window.readyMessageSent !== true
			) {
				unsubscribe();
				window.sendGutenbergReadyMessage();
			}
		} );
		window.subscribed = true;
	}
};
