/**
 * WordPress dependencies
 */
import { useEffect, useMemo } from '@wordpress/element';
import { useEntityRecords } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import type { Field } from '@wordpress/dataviews';
import type { BasePostWithEmbeddedAuthor, BasePost } from '@wordpress/fields';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import { store as editorStore } from '../../store';

interface UsePostFieldsReturn {
	isLoading: boolean;
	fields: Field< BasePostWithEmbeddedAuthor >[];
}

interface Author {
	id: number;
	name: string;
}

function getTitleWithFallbackName( post: BasePost ) {
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
function getParentFieldElements( posts: BasePost[] | undefined | null ) {
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

function usePostFields( {
	postType,
}: {
	postType: string;
} ): UsePostFieldsReturn {
	const { registerPostTypeSchema } = unlock( useDispatch( editorStore ) );
	useEffect( () => {
		registerPostTypeSchema( postType );
	}, [ registerPostTypeSchema, postType ] );

	const { defaultFields } = useSelect(
		( select ) => {
			const { getEntityFields } = unlock( select( editorStore ) );
			return {
				defaultFields: getEntityFields( 'postType', postType ),
			};
		},
		[ postType ]
	);

	const { records: authors, isResolving: isLoadingAuthors } =
		useEntityRecords< Author >( 'root', 'user', { per_page: -1 } );

	const { records: posts, isResolving: isLoadingPosts } =
		useEntityRecords< BasePost >( 'postType', postType, {
			per_page: -1,
			orderby: 'menu_order',
			order: 'asc',
			_fields: 'id,title,parent',
		} );

	const fields = useMemo(
		() =>
			defaultFields.map(
				( field: Field< BasePostWithEmbeddedAuthor > ) => {
					if ( field.id === 'author' ) {
						return {
							...field,
							elements: authors?.map( ( { id, name } ) => ( {
								value: id,
								label: name,
							} ) ),
						};
					}

					if ( field.id === 'parent' ) {
						return {
							...field,
							elements: getParentFieldElements( posts ),
						};
					}

					return field;
				}
			) as Field< BasePostWithEmbeddedAuthor >[],
		[ authors, posts, defaultFields ]
	);

	return {
		isLoading: isLoadingAuthors || isLoadingPosts,
		fields,
	};
}

/**
 * Hook to get the fields for a post (BasePost or BasePostWithEmbeddedAuthor).
 */
export default usePostFields;
