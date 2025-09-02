/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	FormTokenField,
} from '@wordpress/components';
import { useDebounce } from '@wordpress/compose';
import { useState, useEffect, useCallback, useMemo } from '@wordpress/element';
import { useEntityRecords } from '@wordpress/core-data';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Custom hook to manage terms fetching and caching, similar to useProducts.
 *
 * @param {string} taxonomy The taxonomy slug to fetch terms from
 * @param {string} search   Search query string for filtering terms
 * @param {Array}  selected Array of selected term IDs
 * @param {number} parent   Parent term ID for hierarchical filtering
 *
 * @return {Object} Returns:
 *                  - termsMap: Map of terms by id and name for fast lookup
 *                  - termsList: List of terms retrieved
 */
function useTerms( taxonomy, search = '', selected = [], parent ) {
	const [ termsMap, setTermsMap ] = useState( new Map() );
	const [ termsList, setTermsList ] = useState( [] );

	// Fetch terms with search query
	const { records: searchTerms } = useEntityRecords( 'taxonomy', taxonomy, {
		search,
		per_page: search ? 20 : 40, // Limit search results, but get more when not searching
		_fields: 'id,name,slug',
		parent,
	} );

	// Fetch selected terms separately to ensure they're always available
	const { records: selectedTerms } = useEntityRecords( 'taxonomy', taxonomy, {
		include: selected.length > 0 ? selected : undefined,
		per_page: -1, // Get all selected terms
		_fields: 'id,name,slug',
	} );

	useEffect( () => {
		const allTerms = [
			...( selectedTerms || [] ),
			...( searchTerms || [] ),
		];

		// Remove duplicates based on ID
		const uniqueTerms = allTerms.filter(
			( term, index, self ) =>
				index === self.findIndex( ( t ) => t.id === term.id )
		);

		const newTermsMap = new Map();
		uniqueTerms.forEach( ( term ) => {
			newTermsMap.set( term.id, term );
			newTermsMap.set( term.name, term );
		} );

		setTermsList( uniqueTerms );
		setTermsMap( newTermsMap );
	}, [ searchTerms, selectedTerms ] );

	return { termsMap, termsList };
}

const IncludeExcludeControlField = ( { type, termQuery, setQuery } ) => {
	const label = type === 'include' ? __( 'Include' ) : __( 'Exclude' );
	const { taxonomy, include = [], exclude = [] } = termQuery;
	const selectedTermIds = type === 'include' ? include : exclude;
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const { termsMap, termsList } = useTerms(
		taxonomy,
		searchQuery,
		selectedTermIds,
		termQuery.parent
	);
	const handleSearch = useDebounce( setSearchQuery, 250 );

	// Filter out any selected term IDs that no longer exist
	const validSelectedTermIds = useMemo( () => {
		if ( ! selectedTermIds?.length || ! termsMap.size ) {
			return selectedTermIds || [];
		}
		return selectedTermIds.filter( ( id ) => {
			const term = termsMap.get( Number( id ) );
			return !! term;
		} );
	}, [ selectedTermIds, termsMap ] );

	// Updates the query attribute when invalid terms are filtered out
	useEffect( () => {
		if ( validSelectedTermIds.length !== selectedTermIds.length ) {
			setQuery( {
				[ type ]: validSelectedTermIds,
			} );
		}
	}, [ validSelectedTermIds, selectedTermIds, setQuery, type ] );

	const onTokenChange = useCallback(
		( values ) => {
			// Map the tokens to term ids
			const newSelectedTermsSet = values.reduce( ( acc, nameOrId ) => {
				const term =
					termsMap.get( nameOrId ) ||
					termsMap.get( Number( nameOrId ) );
				if ( term ) {
					acc.add( Number( term.id ) );
				}
				return acc;
			}, new Set() );

			setQuery( {
				[ type ]: Array.from( newSelectedTermsSet ),
			} );
		},
		[ setQuery, type, termsMap ]
	);

	const suggestions = useMemo( () => {
		return (
			termsList
				// Filter out terms that are already selected
				.filter(
					( term ) =>
						! validSelectedTermIds?.includes( Number( term.id ) )
				)
				.map( ( term ) => term.name )
		);
	}, [ termsList, validSelectedTermIds ] );

	/**
	 * Transforms a token into a term name.
	 * - If the token is a number, it will be used to lookup the term name.
	 * - Otherwise, the token will be used as is.
	 *
	 * @param {string} token The token to transform
	 * @return {string} The term name
	 */
	const transformTokenIntoTermName = ( token ) => {
		const parsedToken = Number( token );

		if ( Number.isNaN( parsedToken ) ) {
			return decodeEntities( token ) || '';
		}

		const term = termsMap.get( parsedToken );
		return decodeEntities( term?.name ) || '';
	};

	return (
		<FormTokenField
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			displayTransform={ transformTokenIntoTermName }
			label={ label }
			onChange={ onTokenChange }
			onInputChange={ handleSearch }
			suggestions={ suggestions }
			__experimentalValidateInput={ ( value ) =>
				termsMap.has( value ) || termsMap.has( Number( value ) )
			}
			value={ validSelectedTermIds || [] }
			__experimentalExpandOnFocus
			__experimentalShowHowTo={ false }
			placeholder={
				type === 'include'
					? __( 'Search for terms to include…' )
					: __( 'Search for terms to exclude…' )
			}
		/>
	);
};

const IncludeExcludeControl = ( { type, termQuery, setQuery } ) => {
	const label = type === 'include' ? __( 'Include' ) : __( 'Exclude' );
	const { include = [], exclude = [] } = termQuery;
	const selectedTermIds = type === 'include' ? include : exclude;

	const deselectCallback = () => {
		setQuery( { [ type ]: [] } );
	};

	return (
		<ToolsPanelItem
			label={ label }
			hasValue={ () => !! selectedTermIds?.length }
			onDeselect={ deselectCallback }
			resetAllFilter={ deselectCallback }
			isShownByDefault
		>
			<IncludeExcludeControlField
				type={ type }
				termQuery={ termQuery }
				setQuery={ setQuery }
			/>
		</ToolsPanelItem>
	);
};

const IncludeExclude = ( { termQuery, setQuery } ) => {
	return (
		<>
			<IncludeExcludeControl
				type="include"
				termQuery={ termQuery }
				setQuery={ setQuery }
			/>
			<IncludeExcludeControl
				type="exclude"
				termQuery={ termQuery }
				setQuery={ setQuery }
			/>
		</>
	);
};

export default IncludeExclude;
