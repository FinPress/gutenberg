/**
 * Type definitions
 */
export interface WebhookPayloadPushCommitAuthor {
	name: string;
	email: string;
	username: string;
}

/**
 * Minimal type detail of GitHub Push webhook event payload, for lack of their
 * own.
 *
 * TODO: If GitHub improves this on their own webhook payload types, this type
 * should no longer be necessary.
 *
 * @see https://developer.github.com/v3/activity/events/types/#pushevent
 */
export interface WebhookPayloadPushCommit {
	message: string;
	author: WebhookPayloadPushCommitAuthor;
	[ key: string ]: any;
}

/**
 * Given a commit object, returns a promise resolving with the pull request
 * number associated with the commit, or null if an associated pull request
 * cannot be determined.
 *
 * @param commit Commit object.
 *
 * @return Pull request number, or null if it cannot be determined.
 */
function getAssociatedPullRequest(
	commit: WebhookPayloadPushCommit
): number | null {
	const match = commit.message.match( /\(#(\d+)\)$/m );
	return match ? Number( match[ 1 ] ) : null;
}

export default getAssociatedPullRequest;
