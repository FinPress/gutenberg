<?php
/**
 * Bootstraps synchronization (collaborative editing).
 *
 * @package gutenberg
 */

/**
 * Initializes the collaborative editing secret.
 */
function gutenberg_rest_api_init_collaborative_editing() {
	$gutenberg_experiments = get_option( 'gutenberg-experiments' );
	if ( ! $gutenberg_experiments || ! array_key_exists( 'gutenberg-sync-collaboration', $gutenberg_experiments ) ) {
		return;
	}
	$collaborative_editing_secret = get_site_option( 'collaborative_editing_secret' );
	if ( ! $collaborative_editing_secret ) {
		$collaborative_editing_secret = wp_generate_password( 64, false );
	}
	add_site_option( 'collaborative_editing_secret', $collaborative_editing_secret );

	wp_add_inline_script( 'wp-sync', 'window.__experimentalCollaborativeEditingSecret = "' . $collaborative_editing_secret . '";', 'before' );
}
add_action( 'admin_init', 'gutenberg_rest_api_init_collaborative_editing' );

/**
 * Maintains the <-- y:doc !--> comment tag, which contains the Yjs document.
 * For now, it only updates clientid, which can be used so that everyone
 * updates to the rest of the content using the same clientid, ensuring
 * convergence. This algorithm needs to be updated to reflect more edge cases.
 */
function filter_post_content_ydoc( $data, $postarr, $unsanitized_postarr ) {
	if ($data['post_type'] !== 'post' and $data['post_type'] !== 'revision') {
		// $data['post_content'] = '<!-- post_type=' . $data['post_type'] . "-->\n" . $data['post_content'];
		return $data;
	}
	// $c = $data['post_content'];
	// $data['post_content_filtered'] = $c .  "<!-- y:doc -->";
	// $data['post_content'] = $c .  "<!-- y:doc -->";
	// return $data;
	// @todo should we rather use post_content_filtered? What is it for?
	$content = stripslashes($data['post_content']);
	$ynewclientid = rand(0, 9007199254740991); // $yinfo[4];
	$updated_yinfo = '<!-- y:doc session="default_guid" state="" updates=[] new-content-clientid="' . $ynewclientid . '" -->';

	// transform $content if it contains ydoc comment tag
	preg_match('/<!-- y:doc (.*) -->/', $content, $match, PREG_OFFSET_CAPTURE);
	if ($match) {
		// match found
		$content = substr($content, 0, $match[0][1]) . substr($content, $match[0][1] + strlen($match[0][0]));
		preg_match('/session="(.*)" state="(.*)" updates=\[(.*)\] new-content-clientid="(.*)"/', $match[1][0], $yinfo);
		if ($yinfo) {
				$ysessionid = $yinfo[1];
				$ystate = $yinfo[2];
				$yupdates = $yinfo[3];
				// generate a new clientid for updated content that can be represented as a 53bit unsigned integer (max clientid in Yjs)
				$updated_yinfo = '<!-- y:doc session="u' . $ysessionid . '" state="' . $ystate . '" updates=[' . $yupdates . '] new-content-clientid="' . $ynewclientid . '" -->';
		}
	}
	$data['post_content'] = addslashes($updated_yinfo . $content);
	return $data;
}

// This filter must be run after all other filters! Use the highest priority number systemwide.
add_filter( 'wp_insert_post_data', 'filter_post_content_ydoc', 20130220, 3);
