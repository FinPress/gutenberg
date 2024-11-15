/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { useEntityRecords } from '@wordpress/core-data';
import type { Field } from '@wordpress/dataviews';

/**
 * Internal dependencies
 */
import featuredImageField from '../featured-image';
import slugField from '../slug';
import parentField from '../parent';
import passwordField from '../password';
import statusField from '../status';
import commentStatusField from '../comment-status';
import titleField from '../title';
import dateField from '../date';
import authorField from '../author';
import type { BasePostWithEmbeddedAuthor } from '../../types';

interface UsePostFieldsReturn {
	isLoading: boolean;
	fields: Field< BasePostWithEmbeddedAuthor >[];
}

interface Author {
	id: number;
	name: string;
}

function usePostFields(): UsePostFieldsReturn {
	const { records: authors, isResolving: isLoadingAuthors } =
		useEntityRecords< Author >( 'root', 'user', { per_page: -1 } );

	const fields = useMemo(
		() =>
			[
				featuredImageField,
				titleField,
				{
					...authorField,
					elements: authors?.map( ( { id, name } ) => ( {
						value: id,
						label: name,
					} ) ),
				},
				statusField,
				dateField,
				slugField,
				parentField,
				commentStatusField,
				passwordField,
			] as Field< BasePostWithEmbeddedAuthor >[],
		[ authors ]
	);

	return {
		isLoading: isLoadingAuthors,
		fields,
	};
}

/**
 * Hook to get the fields for a post (BasePost or BasePostWithEmbeddedAuthor).
 */
export default usePostFields;
