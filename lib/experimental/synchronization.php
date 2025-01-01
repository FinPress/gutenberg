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
 * Maintains the <!-- y:gutenberg [..] --> comment, which contains the Yjs document
 * state in a base64 encoded format.
 *
 *   <!-- y:gutenberg version="1" state="(base64-encoded Yjs doc)" new-content-clientid="(u53)" -->
 *
 * The comment tag will be maintained as part of the HTML content and enables
 * collaborative clients to exchange editing history.
 * It is meant to keep a Yjs document in-sync with the HTML content. For future
 * compatibility, we also maintain a version flag that can be used in the
 * future by clients to properly handle legacy y:gutenberg comments.
 *
 * The Yjs document state contains information that is needed for automatic
 * conflict resolution to enable collaborative editing on the HTML content.
 * Collaboration-enabled clients will try to keep the Yjs state in-sync with
 * the HTML content.
 *
 * Legacy clients may manipulate the HTML state without updating the Yjs
 * document. Ideally, they leave the y:gutenberg comment alone. Onca e
 * collaboration-enabled client recognizes that the HTML content changed and is
 * not in-sync with the Yjs state, it will update the Yjs document.
 *
 * To ensure that all clients update the Yjs state in "the same way" and
 * produce the same Yjs update, all client must use the same clientid. This
 * clientid must change whenever the HTML content updates, to prevent the
 * creation of conflicting Yjs updates.
 *
 * Note: It is usually not recommended to change the clientid, as this can
 * corrup the Yjs document and make it unusable. Please consult an expert on
 * Yjs CRDTs before changing this approach.
 *
 * This approach is not ideal and may - under very specific circumstances -
 * lead to content duplication.
 *
 * When multiple changes to the HTML document happen (without updating the Yjs
 * state) while multiple collaboration-enabled clients listen to changes, it
 * may result in content duplication.
 *
 * Example:
 *
 *   - change 1: paragraph 1 is added to the HTML content
 *   - change 2: paragraph 2 is added to the HTML content. This change happens
 *     immediately after change 1. So this changes also incorporates the
 *     changeset of change 1.
 *
 * Result:
 *
 *   - Clients that see change 1 will add paragraph 1.
 *   - Clients that see change 2 will add paragraph 1 and paragraph 2.
 *   - In total, three paragraphs are added. The clients have no way of knowing
 *   that change 2 incorporates changes from change 2.
 *
 * If content duplication happens a lot, it may be necessary to increase the
 * debounce interval between fetching document states.
 *
 * A real solution would be to maintain diffs in the y:gutenberg comment when changes
 * happen without Yjs noticing. However, such an implementation will further
 * increase the size of the y:gutenberg comment.
 *
 * In practice, we can accept content duplication in some edge-cases. This
 * is better that the status quo, which overwrites existing content and can
 * lead to data loss.
 */
function filter_post_content_ydoc( $data, $postarr, $unsanitized_postarr ) {
	if ($data['post_type'] !== 'post' and $data['post_type'] !== 'revision') {
		return $data;
	}
	$content = stripslashes($data['post_content']);
	// generate a new clientid for updated content that can be represented as a 53bit unsigned integer (max clientid in Yjs)
	$ynewclientid = rand(0, 9007199254740991); // $yinfo[4];
	$updated_yinfo = '<!-- y:gutenberg version="1" state="" new-content-clientid="' . $ynewclientid . '" -->';
	// transform $content if it contains ydoc comment tag
	preg_match('/<!-- y:gutenberg (.*) -->/', $content, $match, PREG_OFFSET_CAPTURE);
	if ($match) {
		// match found
		$content = substr($content, 0, $match[0][1]) . substr($content, $match[0][1] + strlen($match[0][0]));
		preg_match('/version="(.*)" state="(.*)" new-content-clientid="(.*)"/', $match[1][0], $yinfo);
		if ($yinfo) {
				$yversion = $yinfo[1];
				$ystate = $yinfo[2];
				// always supply a new client id
				$updated_yinfo = '<!-- y:gutenberg version="' . $yversion . '" state="' . $ystate . '" new-content-clientid="' . $ynewclientid . '" -->';
		}
	}
	$data['post_content'] = addslashes($content . $updated_yinfo);
	return $data;
}

// This filter must be run after all other filters! Use the highest priority number systemwide.
add_filter( 'wp_insert_post_data', 'filter_post_content_ydoc', 20130220, 3);

/**
 * The client may request Yjs updates via the heartbeat api. It requests by
 * supplying the last known "new-content-clientid", which changes whenever the
 * document is written to the database. If the requested document has the same
 * "new-content-clientid", then no update will be returned.
 */
function ygutenberg_heartbeat (array $response, array $data) {
  if (empty( $data['y-sync'])) {
		return $response;
	}
	$updatedDocuments = [];

	foreach ($data['y-sync'] as $posttype => $requestedDocs) {
		if (strcmp($posttype, 'postType/Posts') === 0) {
			$docs = [];
			foreach ($requestedDocs as $postid => $expectedClientId) {
				$post = wp_get_post_autosave($postid);
				if ($post) {
					$postcontent = stripslashes($post->post_content);
					preg_match('/<!-- y:gutenberg version="(.*)" state="(.*)" new-content-clientid="(.*)" -->/', $postcontent, $yinfo);
					if ($yinfo and $yinfo[3] !== $expectedClientId) {
						$docs[$postid] = array(
							"contentClientId" => $yinfo[3],
							"state" => $yinfo[2]
						);
					}
				}
			}
			$updatedDocuments[$posttype] = $docs;
		}
	}
	$response['y-sync'] = $updatedDocuments;
	return $response;
}

add_filter('heartbeat_received', 'ygutenberg_heartbeat', 20, 2);
