/**
 * Animation fallback for browsers that don't support scroll-driven animations.
 * This script uses scroll events to update animation progress based on the element's
 * position relative to the viewport, simulating scroll-driven animations.
 */

( function() {
	// Check if the browser supports scroll-driven animations
	// Using window.CSS to avoid linting errors
	const supportsScrollDrivenAnimations =
		window.CSS &&
		window.CSS.supports &&
		window.CSS.supports( 'animation-timeline: scroll()' );

	// If the browser supports scroll-driven animations, we don't need this fallback
	if ( supportsScrollDrivenAnimations ) {
		return;
	}

	// Get all images with animation classes
	const animationSelectors = [
		'.wp-block-image-animation-fade-in img',
		'.wp-block-image-animation-slide-in-left img',
		'.wp-block-image-animation-slide-in-right img',
		'.wp-block-image-animation-slide-in-bottom img',
		'.wp-block-image-animation-scale-in img',
	];

	const animatedImages = document.querySelectorAll(
		animationSelectors.join( ', ' )
	);

	// If there are no animated images, we don't need to do anything
	if ( animatedImages.length === 0 ) {
		return;
	}

	// Check if the user prefers reduced motion
	const prefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;
	if ( prefersReducedMotion ) {
		// Apply final animation state without animating
		animatedImages.forEach( ( image ) => {
			image.style.opacity = '1';
			image.style.transform = 'none';
		} );
		return;
	}

	// Get animation type from parent class
	function getAnimationType( image ) {
		const parent = image.closest( '.wp-block-image' );
		if ( ! parent ) {
			return null;
		}

		if ( parent.classList.contains( 'wp-block-image-animation-fade-in' ) ) {
			return 'fade-in';
		} else if (
			parent.classList.contains(
				'wp-block-image-animation-slide-in-left'
			)
		) {
			return 'slide-in-left';
		} else if (
			parent.classList.contains(
				'wp-block-image-animation-slide-in-right'
			)
		) {
			return 'slide-in-right';
		} else if (
			parent.classList.contains(
				'wp-block-image-animation-slide-in-bottom'
			)
		) {
			return 'slide-in-bottom';
		} else if (
			parent.classList.contains( 'wp-block-image-animation-scale-in' )
		) {
			return 'scale-in';
		}
		return null;
	}

	// Apply styles based on animation progress (0 to 1)
	function applyAnimationStyles( image, progress, type ) {
		// Clamp progress between 0 and 1
		progress = Math.max( 0, Math.min( 1, progress ) );

		switch ( type ) {
			case 'fade-in':
				image.style.opacity = progress.toString();
				break;
			case 'slide-in-left':
				const translateXLeft = -100 * ( 1 - progress );
				image.style.transform = `translateX(${ translateXLeft }%)`;
				image.style.opacity = progress.toString(); // Add opacity for better visual effect
				break;
			case 'slide-in-right':
				const translateXRight = 100 * ( 1 - progress );
				image.style.transform = `translateX(${ translateXRight }%)`;
				image.style.opacity = progress.toString(); // Add opacity for better visual effect
				break;
			case 'slide-in-bottom':
				const translateY = 100 * ( 1 - progress );
				image.style.transform = `translateY(${ translateY }%)`;
				image.style.opacity = progress.toString(); // Add opacity for better visual effect
				break;
			case 'scale-in':
				// Ensure scale-in works by applying both transform and opacity
				const scale = 0.5 + 0.5 * progress;
				image.style.transform = `scale(${ scale })`;
				image.style.opacity = progress.toString();
				break;
		}
	}

	// Calculate animation progress based on element position
	function calculateProgress( image ) {
		const rect = image.getBoundingClientRect();
		const windowHeight = window.innerHeight;
		const elementHeight = rect.height;

		// Animation range is from when the element enters the viewport (10% visible)
		// to when it's 70% into the viewport (ensuring it completes before scrolling off)
		const startPosition = windowHeight - elementHeight * 0.1; // 10% of element visible
		const endPosition = windowHeight * 0.3; // Element is 70% into the viewport

		// Current position of the element's top edge
		const currentPosition = rect.top;

		// Calculate progress
		if ( currentPosition >= startPosition ) {
			return 0; // Not yet in view enough
		}

		if ( currentPosition <= endPosition ) {
			return 1; // Fully in animation range
		}

		// Calculate progress between 0 and 1
		return (
			( startPosition - currentPosition ) /
			( startPosition - endPosition )
		);
	}

	// Update all animated images
	function updateAnimations() {
		animatedImages.forEach( ( image ) => {
			const type = getAnimationType( image );
			if ( ! type ) {
				return;
			}

			const progress = calculateProgress( image );
			applyAnimationStyles( image, progress, type );
		} );
	}

	// Set initial styles
	animatedImages.forEach( ( image ) => {
		const type = getAnimationType( image );
		if ( ! type ) {
			return;
		}

		// Set initial state (progress = 0)
		applyAnimationStyles( image, 0, type );
	} );

	// Add scroll event listener
	window.addEventListener( 'scroll', updateAnimations, { passive: true } );

	// Run once on load
	window.addEventListener( 'load', updateAnimations, { passive: true } );

	// Run on resize as well
	window.addEventListener( 'resize', updateAnimations, { passive: true } );

	// Initial update
	updateAnimations();
} )();
