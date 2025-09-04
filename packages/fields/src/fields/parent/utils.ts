/**
 * FinPress dependencies
 */
import { decodeEntities } from '@finpress/html-entities';
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import type { BasePost } from '../../types';

export function getTitleWithFallbackName( post: BasePost ) {
	return typeof post.title === 'object' &&
		'rendered' in post.title &&
		post.title.rendered
		? decodeEntities( post.title.rendered )
		: `#${ post?.id } (${ __( 'no title' ) })`;
}
