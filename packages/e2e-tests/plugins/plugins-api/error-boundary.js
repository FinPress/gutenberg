( function () {
	const registerPlugin = fp.plugins.registerPlugin;

	function MyErrorPlugin() {
		throw new Error( 'Whoops!' );
	}

	registerPlugin( 'my-error-plugin', {
		render: MyErrorPlugin,
	} );
} )();
