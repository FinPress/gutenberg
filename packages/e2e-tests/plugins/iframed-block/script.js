( ( win ) => {
	const { jQuery: $ } = win;
	win.addEventListener( 'DOMContentLoaded', () => {
		$( '.fp-block-test-iframed-block' ).test();
	} );
} )( window );
