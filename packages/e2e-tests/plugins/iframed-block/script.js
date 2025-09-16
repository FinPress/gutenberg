( ( win ) => {
	const { jQuery: $ } = win;
	win.addEventListener( 'DOMContentLoaded', () => {
		$( '.fin-block-test-iframed-block' ).test();
	} );
} )( window );
