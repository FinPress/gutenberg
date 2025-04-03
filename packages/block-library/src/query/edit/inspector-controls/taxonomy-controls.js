/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	FormTokenField,
	__experimentalVStack as VStack,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';
import { useDebounce } from '@wordpress/compose';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Internal dependencies
 */
import { useTaxonomies } from '../../utils';

const EMPTY_ARRAY = [];
const BASE_QUERY = {
	order: 'asc',
	_fields: 'id,name',
	context: 'view',
};

// Helper function to get the term id based on user input in terms `FormTokenField`.
const getTermIdByTermValue = ( terms, termValue ) => {
	// First we check for exact match by `term.id` or case sensitive `term.name` match.
	const termId =
		termValue?.id || terms?.find( ( term ) => term.name === termValue )?.id;
	if ( termId ) {
		return termId;
	}

	/**
	 * Here we make an extra check for entered terms in a non case sensitive way,
	 * to match user expectations, due to `FormTokenField` behaviour that shows
	 * suggestions which are case insensitive.
	 *
	 * Although WP tries to discourage users to add terms with the same name (case insensitive),
	 * it's still possible if you manually change the name, as long as the terms have different slugs.
	 * In this edge case we always apply the first match from the terms list.
	 */
	const termValueLower = termValue.toLocaleLowerCase();
	return terms?.find(
		( term ) => term.name.toLocaleLowerCase() === termValueLower
	)?.id;
};

export function TaxonomyControls( { onChange, query } ) {
	const { postType, taxQuery } = query;

	const taxonomies = useTaxonomies( postType );
	if ( ! taxonomies || taxonomies.length === 0 ) {
		return null;
	}

	return (
		<VStack spacing={ 4 }>
			{ taxonomies.map( ( taxonomy ) => {
				const termData = taxQuery?.[ taxonomy.slug ];
				const termIds = Array.isArray( termData ) ? termData : [];

				const handleChange = ( newData ) => {
					const newTaxQuery = { ...taxQuery };

					if ( newData.terms?.length ) {
						if ( taxonomy.slug === 'category' ) {
							if ( newData.exclude ) {
								onChange( {
									categories_exclude: newData.terms,
								} );
							} else {
								onChange( {
									categories: newData.terms,
								} );
							}
						} else if ( taxonomy.slug === 'post_tag' ) {
							if ( newData.exclude ) {
								onChange( {
									tags_exclude: newData.terms,
								} );
							} else {
								onChange( {
									tags: newData.terms,
								} );
							}
						} else {
							newTaxQuery[ taxonomy.slug ] = newData.terms;
							onChange( { taxQuery: newTaxQuery } );
						}
					} else if ( taxonomy.slug === 'category' ) {
						onChange( {
							categories: undefined,
							categories_exclude: undefined,
						} );
					} else if ( taxonomy.slug === 'post_tag' ) {
						onChange( {
							tags: undefined,
							tags_exclude: undefined,
						} );
					} else {
						delete newTaxQuery[ taxonomy.slug ];
						onChange( {
							taxQuery:
								Object.keys( newTaxQuery ).length > 0
									? newTaxQuery
									: null,
						} );
					}
				};

				return (
					<TaxonomyItem
						key={ taxonomy.slug }
						taxonomy={ taxonomy }
						termIds={ termIds }
						isExclude={ false }
						onChange={ handleChange }
					/>
				);
			} ) }
		</VStack>
	);
}

/**
 * Renders a `FormTokenField` for a given taxonomy.
 *
 * @param {Object}   props           The props for the component.
 * @param {Object}   props.taxonomy  The taxonomy object.
 * @param {number[]} props.termIds   An array with the block's term ids for the given taxonomy.
 * @param {Function} props.onChange  Callback `onChange` function.
 * @param {string}   props.isExclude Whether the terms should be excluded.
 * @return {JSX.Element}            The rendered component.
 */
function TaxonomyItem( { taxonomy, termIds, onChange, isExclude } ) {
	const [ search, setSearch ] = useState( '' );
	const [ value, setValue ] = useState( EMPTY_ARRAY );
	const [ mode, setMode ] = useState( isExclude ? 'exclude' : 'include' );
	const [ suggestions, setSuggestions ] = useState( EMPTY_ARRAY );
	const debouncedSearch = useDebounce( setSearch, 250 );
	const { searchResults, searchHasResolved } = useSelect(
		( select ) => {
			if ( ! search ) {
				return { searchResults: EMPTY_ARRAY, searchHasResolved: true };
			}
			const { getEntityRecords, hasFinishedResolution } =
				select( coreStore );
			const selectorArgs = [
				'taxonomy',
				taxonomy.slug,
				{
					...BASE_QUERY,
					search,
					orderby: 'name',
					exclude: termIds,
					per_page: 20,
				},
			];
			return {
				searchResults: getEntityRecords( ...selectorArgs ),
				searchHasResolved: hasFinishedResolution(
					'getEntityRecords',
					selectorArgs
				),
			};
		},
		[ search, termIds, taxonomy.slug ]
	);

	const existingTerms = useSelect(
		( select ) => {
			if ( ! termIds?.length ) {
				return EMPTY_ARRAY;
			}
			const { getEntityRecords } = select( coreStore );
			return getEntityRecords( 'taxonomy', taxonomy.slug, {
				...BASE_QUERY,
				include: termIds,
				per_page: termIds.length,
			} );
		},
		[ termIds, taxonomy.slug ]
	);

	useEffect( () => {
		if ( ! termIds?.length ) {
			setValue( EMPTY_ARRAY );
		}
		if ( ! existingTerms?.length ) {
			return;
		}
		const sanitizedValue = termIds.reduce( ( accumulator, id ) => {
			const entity = existingTerms.find( ( term ) => term.id === id );
			if ( entity ) {
				accumulator.push( {
					id,
					value: entity.name,
				} );
			}
			return accumulator;
		}, [] );
		setValue( sanitizedValue );
	}, [ termIds, existingTerms ] );

	useEffect( () => {
		if ( ! searchHasResolved || ! searchResults ) {
			return;
		}
		setSuggestions( searchResults.map( ( result ) => result.name || '' ) );
	}, [ searchResults, searchHasResolved ] );

	const onTermsChange = ( newTermValues ) => {
		const newTermIds = new Set();
		for ( const termValue of newTermValues ) {
			const termId = getTermIdByTermValue( searchResults, termValue );
			if ( termId ) {
				newTermIds.add( termId );
			}
		}
		setSuggestions( EMPTY_ARRAY );

		const terms = Array.from( newTermIds );
		if ( terms.length === 0 ) {
			onChange( {} );
		} else {
			onChange( {
				terms,
				exclude: mode === 'exclude',
			} );
		}
	};

	const onModeChange = ( newMode ) => {
		setMode( newMode );

		if ( termIds.length ) {
			onChange( {
				terms: termIds,
				exclude: newMode === 'exclude',
			} );
		}
	};

	const includeLabel = __( 'Include' );
	const excludeLabel = __( 'Exclude' );
	const taxonomyLabel =
		mode === 'include' ? __( 'Include terms' ) : __( 'Exclude terms' );

	return (
		<div className="block-library-query-inspector__taxonomy-control">
			<VStack spacing={ 2 }>
				<ToggleGroupControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ taxonomy.name }
					value={ mode }
					onChange={ onModeChange }
					isBlock
				>
					<ToggleGroupControlOption
						value="include"
						label={ includeLabel }
					/>
					<ToggleGroupControlOption
						value="exclude"
						label={ excludeLabel }
					/>
				</ToggleGroupControl>
				<FormTokenField
					label={ taxonomyLabel }
					value={ value }
					onInputChange={ debouncedSearch }
					suggestions={ suggestions || [] }
					displayTransform={ decodeEntities }
					onChange={ onTermsChange }
					__experimentalShowHowTo={ false }
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
			</VStack>
		</div>
	);
}
