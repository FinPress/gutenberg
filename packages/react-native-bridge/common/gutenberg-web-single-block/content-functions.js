window.getBlockEditorStore = () => {
	return {
		blockEditorSelect:
			window.fp.data.select( 'core/block-editor' ) ||
			window.fp.data.select( 'core/editor' ), // For FP v5.0 and v5.1.

		blockEditorDispatch:
			window.fp.data.dispatch( 'core/block-editor' ) ||
			window.fp.data.dispatch( 'core/editor' ), // For FP v5.0 and v5.1.
	};
};

window.getHTMLPostContent = () => {
	const { blockEditorSelect } = window.getBlockEditorStore();

	const blocks = blockEditorSelect.getBlocks();
	const HTML = window.fp.blocks.serialize( blocks );
	// Check if platform is iOS
	if ( window.webkit ) {
		window.webkit.messageHandlers.htmlPostContent.postMessage( HTML );
		// Otherwise it\'s Android
	} else {
		window.fpwebkit.postMessage( HTML );
	}
};

window.insertBlock = ( blockHTML ) => {
	// Setup the editor with the inserted block.
	const post = window.fp.data.select( 'core/editor' ).getCurrentPost();
	window.fp.data
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
		window.fpwebkit.gutenbergReady();
	}
	window.readyMessageSent = true;
};

window.isGutenbergReady = () => {
	const currentPost = window.fp.data.select( 'core/editor' ).getCurrentPost();
	return currentPost.id !== undefined;
};

window.startObservingGutenberg = () => {
	if ( window.fp.data && window.subscribed !== true ) {
		if ( window.isGutenbergReady() ) {
			window.sendGutenbergReadyMessage();
			return;
		}

		const unsubscribe = window.fp.data.subscribe( () => {
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
