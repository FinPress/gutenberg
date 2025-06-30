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
 * The comment tag will be part of the HTML content and enables collaborative
 * clients to exchange editing history. It is used to keep a Yjs document
 * in-sync with the HTML content. For forwards-compatibility, we also maintain a
 * version property that can be used in the future by clients to properly handle
 * legacy y:gutenberg comments.
 *
 * The Yjs document state contains information that is needed for automatic
 * conflict resolution to enable collaborative editing on the HTML content.
 * Collaboration-enabled clients will try to keep the Yjs state in-sync with
 * the HTML content.
 *
 * Legacy clients may manipulate the HTML state without updating the Yjs
 * document. Ideally, they leave the y:gutenberg comment alone. Once a
 * collaboration-enabled client recognizes that the HTML content changed and is
 * not in-sync with the Yjs state, it will update the Yjs document.
 *
 * To ensure that all clients update the Yjs state in "the same way" and
 * produce the same Yjs update, all client must use the same Yjs-clientid. This
 * clientid must change whenever the HTML content updates, to prevent the
 * creation of conflicting Yjs updates.
 *
 * Note: Yjs has a concept of clientId that is very different from the
 * clientIds used in the block editor. Yjs' clientIds should be unique per
 * client (i.e. each browser tab has a different clientId) and are used for
 * conflict-resolution.
 *
 * It is usually not recommended to change the clientid, as this can corrup the
 * Yjs document and make it unusable. Please consult an expert on Yjs CRDTs
 * before changing this approach.
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
 *   - Change 1: Paragraph 1 is added to the HTML content without updating the
 *               Yjs document.
 *   - Change 2: Paragraph 2 is added to the HTML content without updating the
 *               Yjs document. This change happens immediately after change 1.
 *               So this changes also incorporates the changeset of change 1.
 *
 * Result:
 *
 *   - Clients that see change 1 will add paragraph 1 to the Yjs document.
 *   - Clients that see change 2 will add paragraph 1 and paragraph 2 to the
 *     Yjs document, using a different clientid.
 *   - In total, three paragraphs are added. The clients have no way of knowing
 *     that change 2 incorporates changes from change 2.
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
function gutenberg_filter_post_content_ydoc( $data ) {
	if ( 'post' !== $data['post_type'] and 'revision' !== $data['post_type'] ) {
		return $data;
	}
	$gutenberg_experiments = get_option( 'gutenberg-experiments' );
	if ( ! $gutenberg_experiments || ! array_key_exists( 'gutenberg-sync-collaboration', $gutenberg_experiments ) ) {
		return $data;
	}
	$content = stripslashes( $data['post_content'] );
	// transform $content if it contains ydoc comment tag
	$yinfo = gutenberg_get_yinfo( $content );
	if ( $yinfo ) {
		$content = substr( $content, 0, $yinfo['commentStart'] ) . substr( $content, $yinfo['commentEnd'] );
		// Always supply a new client id after any change. Generate a new clientid
		// for updated content that can be represented as a 53bit unsigned integer
		// (max clientid in Yjs).
		$ynewclientid         = wp_rand( 0, 9007199254740991 ); // This is 2^53 – 1 which is `Number.MAX_SAFE_INTEGER` from JavaScript
		$updated_yinfo        = '<!-- y:gutenberg version="' . $yinfo['version'] . '" state="' . $yinfo['state'] . '" new-content-clientid="' . $ynewclientid . '" -->';
		$data['post_content'] = addslashes( $content . $updated_yinfo );
	}
	return $data;
}
add_filter( 'wp_insert_post_data', 'gutenberg_filter_post_content_ydoc', 10, 1 );

/**
 * Extracts the <!-- y:gutenberg .. --> comment from HTML $content and returns the encoded data.
 */
function gutenberg_get_yinfo( $content ) {
	preg_match( '/<!-- y:gutenberg version=\"([a-zA-Z0-9]*)\" state=\"([a-zA-Z0-9+\/]*={0,3})\" new-content-clientid=\"([0-9]*)\" -->/', $content, $match, PREG_OFFSET_CAPTURE );
	if ( $match ) {
		return array(
			'comment'              => $match[0][0],
			'version'              => $match[1][0],
			'state'                => $match[2][0],
			'new-content-clientid' => $match[3][0],
			'commentStart'         => $match[0][1],
			'commentEnd'           => $match[0][1] + strlen( $match[0][0] ),
		);
	}
	return null;
}
