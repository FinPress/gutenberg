/**
 * WordPress dependencies
 */
import { ComboboxControl, ExternalLink } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import {
	createInterpolateElement,
	useCallback,
	useMemo,
	useState,
} from '@wordpress/element';
// @ts-ignore
import { store as coreStore } from '@wordpress/core-data';
import type { DataFormControlProps } from '@wordpress/dataviews';

/**
 * External dependencies
 */
import removeAccents from 'remove-accents';

/**
 * Internal dependencies
 */
import { debounce } from '@wordpress/compose';
import { decodeEntities } from '@wordpress/html-entities';
import { __, sprintf } from '@wordpress/i18n';
import type { BasePost } from '../../types';
import { getTitleWithFallbackName } from './utils';

type TreeBase = {
	id: string;
	name: string;
	[ key: string ]: any;
};

type TreeWithParent = TreeBase & {
	parent: number;
};

type TreeWithoutParent = TreeBase & {
	parent: null;
};

type Tree = TreeWithParent | TreeWithoutParent;

function buildTermsTree( flatTerms: Tree[] ) {
	const flatTermsWithParentAndChildren = flatTerms.map( ( term ) => {
		return {
			children: [],
			...term,
		};
	} );

	// All terms should have a `parent` because we're about to index them by it.
	if (
		flatTermsWithParentAndChildren.some(
			( { parent } ) => parent === null || parent === undefined
		)
	) {
		return flatTermsWithParentAndChildren as TreeWithParent[];
	}

	const termsByParent = (
		flatTermsWithParentAndChildren as TreeWithParent[]
	 ).reduce(
		( acc, term ) => {
			const { parent } = term;
			if ( ! acc[ parent ] ) {
				acc[ parent ] = [];
			}
			acc[ parent ].push( term );
			return acc;
		},
		{} as Record< string, Array< TreeWithParent > >
	);

	const fillWithChildren = (
		terms: Array< TreeWithParent >
	): Array< TreeWithParent > => {
		return terms.map( ( term ) => {
			const children = termsByParent[ term.id ];
			return {
				...term,
				children:
					children && children.length
						? fillWithChildren( children )
						: [],
			};
		} );
	};

	return fillWithChildren( termsByParent[ '0' ] || [] );
}

export const getItemPriority = ( name: string, searchValue: string ) => {
	const normalizedName = removeAccents( name || '' ).toLowerCase();
	const normalizedSearch = removeAccents( searchValue || '' ).toLowerCase();
	if ( normalizedName === normalizedSearch ) {
		return 0;
	}

	if ( normalizedName.startsWith( normalizedSearch ) ) {
		return normalizedName.length;
	}

	return Infinity;
};

export function PageAttributesParent( {
	data,
	onChangeControl,
}: {
	data: BasePost;
	onChangeControl: ( newValue: string ) => void;
} ) {
	const [ fieldValue, setFieldValue ] = useState< null | string >( null );

	const pageId = data.parent;
	const postId = data.id;
	const postTypeSlug = data.type;
	const parentPostId = data.parent?.toString();

	const { parentPostTitle, pageItems, isHierarchical } = useSelect(
		( select ) => {
			// @ts-expect-error getPostType is not typed
			const { getEntityRecord, getEntityRecords, getPostType } =
				select( coreStore );

			const postTypeInfo = getPostType( postTypeSlug );

			const postIsHierarchical =
				postTypeInfo?.hierarchical && postTypeInfo.viewable;

			const parentPost = pageId
				? getEntityRecord< BasePost >(
						'postType',
						postTypeSlug,
						pageId
				  )
				: null;

			const query = {
				per_page: 100,
				exclude: postId?.toString(),
				parent_exclude: postId?.toString(),
				orderby: 'menu_order',
				order: 'asc',
				_fields: 'id,title,parent',
				...( fieldValue !== null && {
					search: fieldValue,
				} ),
			};

			return {
				isHierarchical: postIsHierarchical,
				parentPostTitle: parentPost
					? getTitleWithFallbackName( parentPost )
					: '',
				pageItems: postIsHierarchical
					? getEntityRecords< BasePost >(
							'postType',
							postTypeSlug,
							query
					  )
					: null,
			};
		},
		[ fieldValue, pageId, postId, postTypeSlug ]
	);

	const parentOptions = useMemo( () => {
		const getOptionsFromTree = (
			tree: Array< Tree >,
			level = 0
		): Array< {
			value: string;
			label: string;
			rawName: string;
		} > => {
			const mappedNodes = tree.map( ( treeNode ) => [
				{
					value: treeNode.id,
					label:
						'— '.repeat( level ) + decodeEntities( treeNode.name ),
					rawName: treeNode.name,
				},
				...getOptionsFromTree( treeNode.children || [], level + 1 ),
			] );

			const sortedNodes = mappedNodes.sort( ( [ a ], [ b ] ) => {
				const priorityA = getItemPriority(
					a.rawName,
					fieldValue ?? ''
				);
				const priorityB = getItemPriority(
					b.rawName,
					fieldValue ?? ''
				);
				return priorityA >= priorityB ? 1 : -1;
			} );

			return sortedNodes.flat();
		};

		if ( ! pageItems ) {
			return [];
		}

		let tree = pageItems.map( ( item ) => ( {
			id: item.id.toString(),
			parent: item.parent ?? null,
			name: getTitleWithFallbackName( item ),
		} ) );

		// Only build a hierarchical tree when not searching.
		if ( ! fieldValue ) {
			tree = buildTermsTree( tree );
		}

		const opts = getOptionsFromTree( tree );

		// Ensure the current parent is in the options list.
		const optsHasParent = opts.find(
			( item ) => item.value === parentPostId?.toString()
		);
		if ( parentPostId && parentPostTitle && ! optsHasParent ) {
			opts.unshift( {
				value: parentPostId,
				label: parentPostTitle,
				rawName: '',
			} );
		}
		return opts;
	}, [ pageItems, fieldValue, parentPostTitle, parentPostId ] );

	if ( ! isHierarchical ) {
		return null;
	}

	/**
	 * Handle user input.
	 *
	 * @param {string} inputValue The current value of the input field.
	 */
	const handleKeydown = ( inputValue: string ) => {
		setFieldValue( inputValue );
	};

	/**
	 * Handle author selection.
	 *
	 * @param {Object} selectedPostId The selected Author.
	 */
	const handleChange = ( selectedPostId: string | null | undefined ) => {
		if ( selectedPostId ) {
			return onChangeControl( selectedPostId );
		}

		onChangeControl( '' );
	};

	return (
		<ComboboxControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			label={ __( 'Parent' ) }
			help={ __( 'Choose a parent page.' ) }
			value={ parentPostId }
			options={ parentOptions }
			onFilterValueChange={ debounce(
				( value: unknown ) => handleKeydown( value as string ),
				300
			) }
			onChange={ handleChange }
			hideLabelFromVision
		/>
	);
}

export const ParentEdit = ( {
	data,
	field,
	onChange,
}: DataFormControlProps< BasePost > ) => {
	const { id } = field;

	const onChangeControl = useCallback(
		( newValue?: string ) =>
			onChange( {
				[ id ]: newValue,
			} ),
		[ id, onChange ]
	);

	return (
		<fieldset className="fields-controls__parent">
			<div>
				{ createInterpolateElement(
					sprintf(
						/* translators: %1$s The home URL of the WordPress installation without the scheme. */
						__(
							'Child pages inherit characteristics from their parent, such as URL structure. For instance, if "Pricing" is a child of "Services", its URL would be %1$s<wbr />/services<wbr />/pricing.'
						),
						'test'
					),
					{
						wbr: <wbr />,
					}
				) }
				<p>
					{ createInterpolateElement(
						__(
							'They also show up as sub-items in the default navigation menu. <a>Learn more.</a>'
						),
						{
							a: (
								<ExternalLink
									href={ __(
										'https://wordpress.org/documentation/article/page-post-settings-sidebar/#page-attributes'
									) }
									children={ undefined }
								/>
							),
						}
					) }
				</p>
				<PageAttributesParent
					data={ data }
					onChangeControl={ onChangeControl }
				/>
			</div>
		</fieldset>
	);
};
