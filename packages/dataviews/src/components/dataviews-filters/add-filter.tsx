/**
 * External dependencies
 */
import type { Ref } from 'react';

/**
 * WordPress dependencies
 */
import {
	privateApis as componentsPrivateApis,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import type { NormalizedFilter, View } from '../../types';

const { Menu } = unlock( componentsPrivateApis );

interface AddFilterProps {
	filters: NormalizedFilter[];
	view: View;
	onChangeView: ( view: View ) => void;
	setOpenedFilter: ( filter: string | null ) => void;
	addFilterOpen: boolean;
	setAddFilterOpen: ( open: boolean ) => void;
}

export function AddFilterMenu( {
	filters,
	view,
	onChangeView,
	setOpenedFilter,
	trigger,
	addFilterOpen,
	setAddFilterOpen,
}: AddFilterProps & {
	trigger: React.ReactNode;
} ) {
	const inactiveFilters = filters.filter( ( filter ) => ! filter.isVisible );
	return (
		<Menu
			trigger={ trigger }
			defaultOpen={ inactiveFilters.length === filters.length }
			open={ addFilterOpen }
			onOpenChange={ setAddFilterOpen }
		>
			{ inactiveFilters.map( ( filter ) => {
				return (
					<Menu.Item
						key={ filter.field }
						onClick={ () => {
							setOpenedFilter( filter.field );
							onChangeView( {
								...view,
								page: 1,
								filters: [
									...( view.filters || [] ),
									{
										field: filter.field,
										value: undefined,
										operator: filter.operators[ 0 ],
									},
								],
							} );
						} }
					>
						<Menu.ItemLabel>{ filter.name }</Menu.ItemLabel>
					</Menu.Item>
				);
			} ) }
		</Menu>
	);
}

function AddFilter(
	{ filters, ...rest }: AddFilterProps,
	ref: Ref< HTMLButtonElement >
) {
	if ( ! filters.length || filters.every( ( { isPrimary } ) => isPrimary ) ) {
		return null;
	}
	const inactiveFilters = filters.filter( ( filter ) => ! filter.isVisible );
	return (
		<AddFilterMenu
			trigger={
				<Button
					accessibleWhenDisabled
					size="compact"
					className="dataviews-filters-button"
					variant="tertiary"
					disabled={ ! inactiveFilters.length }
					ref={ ref }
				>
					{ __( 'Add filter' ) }
				</Button>
			}
			{ ...{ filters, ...rest } }
		/>
	);
}

export default forwardRef( AddFilter );
