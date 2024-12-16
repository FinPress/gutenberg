/**
 * WordPress dependencies
 */
import { useState, useRef, useMemo, useEffect } from '@wordpress/element';
import { __experimentalHStack as HStack, Button } from '@wordpress/components';
import { funnel } from '@wordpress/icons';
import { _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import FilterSummary from './filter-summary';
import { default as AddFilter } from './add-filter';
import ResetFilters from './reset-filters';
import { sanitizeOperators } from '../../utils';
import { ALL_OPERATORS, OPERATOR_IS, OPERATOR_IS_NOT } from '../../constants';
import type { NormalizedFilter, NormalizedField, View } from '../../types';

export function useFilters( fields: NormalizedField< any >[], view: View ) {
	return useMemo( () => {
		const filters: NormalizedFilter[] = [];
		fields.forEach( ( field ) => {
			if ( ! field.elements?.length ) {
				return;
			}

			const operators = sanitizeOperators( field );
			if ( operators.length === 0 ) {
				return;
			}

			const isPrimary = !! field.filterBy?.isPrimary;
			filters.push( {
				field: field.id,
				name: field.label,
				elements: field.elements,
				singleSelection: operators.some( ( op ) =>
					[ OPERATOR_IS, OPERATOR_IS_NOT ].includes( op )
				),
				operators,
				isVisible:
					isPrimary ||
					!! view.filters?.some(
						( f ) =>
							f.field === field.id &&
							ALL_OPERATORS.includes( f.operator )
					),
				isPrimary,
			} );
		} );
		// Sort filters by primary property. We need the primary filters to be first.
		// Then we sort by name.
		filters.sort( ( a, b ) => {
			if ( a.isPrimary && ! b.isPrimary ) {
				return -1;
			}
			if ( ! a.isPrimary && b.isPrimary ) {
				return 1;
			}
			return a.name.localeCompare( b.name );
		} );
		return filters;
	}, [ fields, view ] );
}

function Add( {
	filters,
	view,
	onChangeView,
	buttonRef,
	isShowingFilter,
	setIsShowingFilter,
	addFilterRef,
	setOpenedFilter,
}: {
	filters: NormalizedFilter[];
	view: View;
	onChangeView: ( view: View ) => void;
	buttonRef: React.RefObject< HTMLButtonElement >;
	isShowingFilter: boolean;
	setIsShowingFilter: ( isShowingFilter: boolean ) => void;
	addFilterRef: React.RefObject< HTMLButtonElement >;
	setOpenedFilter: ( filter: string | null ) => void;
} ) {
	const [ addFilterOpen, setAddFilterOpen ] = useState< boolean >(
		! view.filters?.length
	);

	useEffect( () => {
		if ( isShowingFilter && ! view.filters?.length && ! addFilterOpen ) {
			setIsShowingFilter( false );
			buttonRef.current?.focus();
		}
	}, [
		view.filters,
		addFilterOpen,
		isShowingFilter,
		buttonRef,
		setIsShowingFilter,
	] );

	return (
		<AddFilter
			filters={ filters }
			view={ view }
			onChangeView={ onChangeView }
			ref={ addFilterRef }
			setOpenedFilter={ setOpenedFilter }
			addFilterOpen={ addFilterOpen }
			setAddFilterOpen={ setAddFilterOpen }
		/>
	);
}

export default function useDataViewsFilters( {
	fields,
	view,
	onChangeView,
	openedFilter,
	setOpenedFilter,
}: {
	fields: NormalizedField< any >[];
	view: View;
	onChangeView: ( view: View ) => void;
	openedFilter: string | null;
	setOpenedFilter: ( filter: string | null ) => void;
} ) {
	const filters = useFilters( fields, view );
	const [ isShowingFilter, setIsShowingFilter ] = useState< boolean >( () =>
		( filters || [] ).some( ( filter ) => filter.isPrimary )
	);
	const buttonRef = useRef< HTMLButtonElement >( null );
	const addFilterRef = useRef< HTMLButtonElement >( null );

	if ( filters.length === 0 ) {
		return { toggle: null, area: null };
	}

	const toggle = (
		<div className="dataviews-filters__container-visibility-toggle">
			<Button
				ref={ buttonRef }
				className="dataviews-filters__visibility-toggle"
				size="compact"
				icon={ funnel }
				label={ _x( 'Filter', 'verb' ) }
				aria-expanded={ isShowingFilter }
				isPressed={ isShowingFilter }
				onClick={ () => {
					if ( ! isShowingFilter ) {
						setOpenedFilter( null );
					}
					setIsShowingFilter( ! isShowingFilter );
				} }
			/>
			{ !! view.filters?.length && (
				<span className="dataviews-filters-toggle__count">
					{ view.filters.length }
				</span>
			) }
		</div>
	);
	const area = (
		<HStack
			justify="flex-start"
			style={ { width: 'fit-content' } }
			className="dataviews-filters__container"
			wrap
		>
			{ filters
				.filter( ( filter ) => filter.isVisible )
				.map( ( filter ) => {
					return (
						<FilterSummary
							key={ filter.field }
							filter={ filter }
							view={ view }
							onChangeView={ onChangeView }
							addFilterRef={ addFilterRef }
							openedFilter={ openedFilter }
						/>
					);
				} ) }
			<Add
				filters={ filters }
				view={ view }
				onChangeView={ onChangeView }
				addFilterRef={ addFilterRef }
				setOpenedFilter={ setOpenedFilter }
				buttonRef={ buttonRef }
				isShowingFilter={ isShowingFilter }
				setIsShowingFilter={ setIsShowingFilter }
			/>
			<ResetFilters
				filters={ filters }
				view={ view }
				onChangeView={ onChangeView }
			/>
		</HStack>
	);

	return { toggle, area: isShowingFilter ? area : null };
}
