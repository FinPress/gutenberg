( function () {
	const registerPlugin = fin.plugins.registerPlugin;

	function MyErrorPlugin() {
		throw new Error( 'Whoops!' );
	}

	registerPlugin( 'my-error-plugin', {
		render: MyErrorPlugin,
	} );
} )();
