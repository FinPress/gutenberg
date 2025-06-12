/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import { store as editorStore } from '@wordpress/editor';

/**
 * Returns the Post's Edit URL.
 *
 * @param {number} postId Post ID.
 *
 * @return {string} Post edit URL.
 */
export function getPostEditURL( postId ) {
	return addQueryArgs( 'post.php', { post: postId, action: 'edit' } );
}

/**
 * Replaces the browser URL with a post editor link for the given post ID.
 *
 * Note it is important that, since this function may be called when the
 * editor first loads, the result generated `getPostEditURL` matches that
 * produced by the server. Otherwise, the URL will change unexpectedly.
 *
 * @param {number} postId Post ID for which to generate post editor URL.
 */
function setBrowserURL( postId ) {
	window.history.replaceState(
		{ id: postId },
		'Post ' + postId,
		getPostEditURL( postId )
	);
}

export function BrowserURL( { postId, postStatus } ) {
	const [ historyId, setHistoryId ] = useState( null );

	useEffect( () => {
		if ( postId !== historyId && postStatus !== 'auto-draft' && postId ) {
			setBrowserURL( postId );
			setHistoryId( postId );
		}
	}, [ postId, postStatus, historyId ] );

	return null;
}

export default withSelect( ( select ) => {
	const { getCurrentPost } = select( editorStore );
	const post = getCurrentPost();
	let { id, status, type } = post;
	const isTemplate = [ 'wp_template', 'wp_template_part' ].includes( type );
	if ( isTemplate ) {
		id = post.wp_id;
	}

	return {
		postId: id,
		postStatus: status,
	};
} )( BrowserURL );
