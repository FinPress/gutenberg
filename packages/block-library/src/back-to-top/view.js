document.addEventListener( 'DOMContentLoaded', function () {
	const backToTopButtons = document.querySelectorAll(
		'.wp-block-back-to-top'
	);

	backToTopButtons.forEach( ( button ) => {
		// Get settings from data attributes
		const scrollOffset = parseInt( button.dataset.scrollOffset || 300, 10 );
		const scrollDuration = parseInt(
			button.dataset.scrollDuration || 500,
			10
		);
		const smoothScroll = button.dataset.smoothScroll !== 'false';

		// Initial state
		button.style.opacity = '0';
		button.style.visibility = 'hidden';
		button.style.transition =
			'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out';
		button.style.position = 'fixed';
		button.style.zIndex = '9999';

		// Handle scroll visibility
		function handleScroll() {
			if ( window.pageYOffset > scrollOffset ) {
				button.style.visibility = 'visible';
				button.style.opacity = '1';
			} else {
				button.style.opacity = '0';
				button.style.visibility = 'hidden';
			}
		}

		// Smooth scroll with duration support
		function smoothScrollToTop( duration ) {
			const startPosition = window.pageYOffset;
			const startTime = window.performance.now();

			function scrollStep( currentTime ) {
				const timeElapsed = currentTime - startTime;
				const progress = Math.min( timeElapsed / duration, 1 );

				// Easing function
				const easeInOutCubic =
					progress < 0.5
						? 4 * progress * progress * progress
						: 1 - Math.pow( -2 * progress + 2, 3 ) / 2;

				window.scrollTo( 0, startPosition * ( 1 - easeInOutCubic ) );

				if ( timeElapsed < duration ) {
					window.requestAnimationFrame( scrollStep );
				}
			}

			window.requestAnimationFrame( scrollStep );
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
			if ( smoothScroll ) {
				smoothScrollToTop( scrollDuration );
			} else {
				window.scrollTo( { top: 0 } );
			}
		} );

		// Initial check
		handleScroll();
	} );
} );
