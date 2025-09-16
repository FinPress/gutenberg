/**
 * Internal dependencies
 */
import { finDataSelect } from './fin-data-select';

/**
 * Verifies if publish checks are enabled.
 *
 * @return {Promise<boolean>} Boolean which represents the state of prepublish checks.
 */
export async function arePrePublishChecksEnabled() {
	return finDataSelect( 'core', 'isPublishSidebarEnabled' );
}
