document.addEventListener( 'DOMContentLoaded', function () {
	const likedPostsElement = document.getElementById( 'liked-posts' );

	// Get liked posts from localStorage for logged-out users.
	const likedPosts =
		JSON.parse( window.localStorage.getItem( 'likedPosts' ) ) || [];

	if ( likedPosts.length === 0 ) {
		likedPostsElement.innerHTML = '<p>No liked posts found.</p>';
		return;
	}

	// Fetch post data from WordPress REST API.
	fetch( `/wp-json/wp/v2/posts?include=${ likedPosts.join( ',' ) }` )
		.then( ( response ) => response.json() )
		.then( ( posts ) => {
			let output = '';
			posts.forEach( ( post ) => {
				output += `<li><h2><a href="${ post.link }">${ post.title.rendered }</a></h2></li>`;
			} );
			likedPostsElement.innerHTML = output;
		} )
		.catch(
			() =>
				( likedPostsElement.innerHTML = "<p>Couldn't fetch posts.</p>" )
		);
} );
