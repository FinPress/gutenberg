/**
 * Animation fallback for browsers that don't support scroll-driven animations.
 * This script uses IntersectionObserver to detect when an image enters the viewport
 * and applies the appropriate animation class.
 */

( function () {
	// Check if the browser supports scroll-driven animations
	// Using window.CSS to avoid linting errors
	const supportsScrollDrivenAnimations =
		window.CSS &&
		window.CSS.supports &&
		window.CSS.supports( 'animation-timeline: view()' );

	// If the browser supports scroll-driven animations, we don't need this fallback
	if ( supportsScrollDrivenAnimations ) {
		return;
	}

	// Get all images with animation classes
	const animatedImages = document.querySelectorAll(
		'.wp-block-image-animation-fade-in img, ' +
			'.wp-block-image-animation-slide-in-left img, ' +
			'.wp-block-image-animation-slide-in-right img, ' +
			'.wp-block-image-animation-slide-in-bottom img, ' +
			'.wp-block-image-animation-scale-in img'
	);

	// If there are no animated images, we don't need to do anything
	if ( animatedImages.length === 0 ) {
		return;
	}

	// Check if the browser supports IntersectionObserver
	if ( 'IntersectionObserver' in window ) {
		// Create an IntersectionObserver
		const observer = new window.IntersectionObserver(
			( entries ) => {
				entries.forEach( ( entry ) => {
					// If the image is in the viewport
					if ( entry.isIntersecting ) {
						// Add the animation class
						entry.target.classList.add( 'animated' );
						// Stop observing this image
						observer.unobserve( entry.target );
					}
				} );
			},
			{
				// Start the animation when the image is 10% visible
				threshold: 0.1,
			}
		);

		// Observe each animated image
		animatedImages.forEach( ( image ) => {
			observer.observe( image );
		} );
	}
} )();
