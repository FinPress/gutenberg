document.addEventListener( 'DOMContentLoaded', function () {
	const backToTopButtons = document.querySelectorAll(
		'.wp-block-back-to-top'
	);

	backToTopButtons.forEach( ( button ) => {
		const scrollOffset = parseInt( button.dataset.scrollOffset || 300, 10 );

		// Initial state
		button.style.opacity = '0';
		button.style.visibility = 'hidden';
		button.style.transition =
			'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out';
		button.style.position = 'fixed';
		button.style.zIndex = '9999';

		// Handle scroll
		function handleScroll() {
			if ( window.pageYOffset > scrollOffset ) {
				button.style.visibility = 'visible';
				button.style.opacity = '1';
			} else {
				button.style.opacity = '0';
				button.style.visibility = 'hidden';
			}
		}

		// Throttle scroll event
		let ticking = false;
		window.addEventListener( 'scroll', function () {
			if ( ! ticking ) {
				window.requestAnimationFrame( function () {
					handleScroll();
					ticking = false;
				} );
				ticking = true;
			}
		} );

		// Handle click
		button.addEventListener( 'click', function ( e ) {
			e.preventDefault();
			window.scrollTo( {
				top: 0,
				behavior: 'smooth',
			} );
		} );

		// Initial check
		handleScroll();
	} );
} );
