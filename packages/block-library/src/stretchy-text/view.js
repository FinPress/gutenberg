document.addEventListener( 'DOMContentLoaded', () => {
	const observer = new window.ResizeObserver( ( entries ) => {
		entries.forEach( ( { target } ) => {
			const { offsetWidth, offsetHeight } = target;
			target
				.closest( 'svg' )
				.setAttribute(
					'viewBox',
					`0 0 ${ offsetWidth } ${ offsetHeight }`
				);
		} );
	} );

	document
		.querySelectorAll( '.wp-block-stretchy-text > foreignObject > span' )
		.forEach( ( element ) => {
			observer.observe( element );
		} );
} );
