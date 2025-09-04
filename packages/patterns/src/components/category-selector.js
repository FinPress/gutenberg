/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { useMemo, useState } from '@finpress/element';
import { FormTokenField } from '@finpress/components';
import { useDebounce } from '@finpress/compose';
import { decodeEntities } from '@finpress/html-entities';

const unescapeString = ( arg ) => {
	return decodeEntities( arg );
};

export const CATEGORY_SLUG = 'wp_pattern_category';

export default function CategorySelector( {
	categoryTerms,
	onChange,
	categoryMap,
} ) {
	const [ search, setSearch ] = useState( '' );
	const debouncedSearch = useDebounce( setSearch, 500 );

	const suggestions = useMemo( () => {
		return Array.from( categoryMap.values() )
			.map( ( category ) => unescapeString( category.label ) )
			.filter( ( category ) => {
				if ( search !== '' ) {
					return category
						.toLowerCase()
						.includes( search.toLowerCase() );
				}
				return true;
			} )
			.sort( ( a, b ) => a.localeCompare( b ) );
	}, [ search, categoryMap ] );

	function handleChange( termNames ) {
		const uniqueTerms = termNames.reduce( ( terms, newTerm ) => {
			if (
				! terms.some(
					( term ) => term.toLowerCase() === newTerm.toLowerCase()
				)
			) {
				terms.push( newTerm );
			}
			return terms;
		}, [] );

		onChange( uniqueTerms );
	}

	return (
		<FormTokenField
			className="patterns-menu-items__convert-modal-categories"
			value={ categoryTerms }
			suggestions={ suggestions }
			onChange={ handleChange }
			onInputChange={ debouncedSearch }
			label={ __( 'Categories' ) }
			tokenizeOnBlur
			__experimentalExpandOnFocus
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>
	);
}
