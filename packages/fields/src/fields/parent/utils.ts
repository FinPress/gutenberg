/**
 * WordPress dependencies
 */
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';

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

/**
 * Transforms posts into filter elements for the parent field.
 * Filters out posts that have no children.
 *
 * @param posts - Array of posts to transform.
 * @return Array of filter elements.
 */
export function getParentFieldElements( posts: BasePost[] | undefined | null ) {
	if ( ! posts ) {
		return [];
	}

	const postsWithChildren = posts.filter( ( post ) => {
		return posts.some( ( otherPost ) => otherPost.parent === post.id );
	} );

	return [
		{ value: 0, label: __( 'None' ) },
		...postsWithChildren.map( ( post ) => ( {
			value: Number( post.id ),
			label: getTitleWithFallbackName( post ),
		} ) ),
	];
}
