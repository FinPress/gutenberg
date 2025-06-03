const videos = document.querySelectorAll( 'video' );

videos.forEach( function ( video ) {
	video.addEventListener(
		'loadedmetadata',
		function () {
			video.load();
		},
		{ once: true }
	);
} );
