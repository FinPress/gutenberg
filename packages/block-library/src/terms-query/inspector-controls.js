/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';

export default function TermsQueryInspectorControls( {
	attributes,
	setQuery,
	setAttributes,
} ) {
	const { query } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const { taxonomies } = useSelect( ( select ) => {
		const { getEntityRecords } = select( coreStore );
		const allTaxonomies = getEntityRecords( 'root', 'taxonomy' );
		return {
			taxonomies:
				allTaxonomies?.filter( ( t ) => t.visibility.public ) || [],
		};
	}, [] );

	const taxonomyOptions = taxonomies.map( ( taxonomy ) => ( {
		label: taxonomy.name,
		value: taxonomy.slug,
	} ) );

	return (
		<ToolsPanel
			label={ __( 'Terms Query Settings' ) }
			resetAll={ () => {
				setAttributes( {
					query: {
						perPage: 10,
						pages: 0,
						offset: 0,
						taxonomy: 'category',
						order: 'asc',
						orderBy: 'name',
						hideEmpty: false,
						hierarchical: false,
						parent: 0,
						exclude: [],
						include: [],
						search: '',
						inherit: false,
					},
				} );
			} }
			dropdownMenuProps={ dropdownMenuProps }
		>
			<ToolsPanelItem
				hasValue={ () => query.taxonomy !== 'category' }
				label={ __( 'Taxonomy' ) }
				onDeselect={ () => setQuery( { taxonomy: 'category' } ) }
				isShownByDefault
			>
				<SelectControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'Taxonomy' ) }
					options={ taxonomyOptions }
					value={ query.taxonomy }
					onChange={ ( selectedTaxonomy ) =>
						setQuery( { taxonomy: selectedTaxonomy } )
					}
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				hasValue={ () => query.perPage !== null }
				label={ __( 'Terms per page' ) }
				onDeselect={ () => setQuery( { perPage: null } ) }
				isShownByDefault
			>
				<RangeControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'Terms per page' ) }
					value={ query.perPage }
					onChange={ ( perPage ) => setQuery( { perPage } ) }
					min={ 1 }
					max={ 100 }
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				hasValue={ () => query.order !== 'asc' }
				label={ __( 'Order' ) }
				onDeselect={ () => setQuery( { order: 'asc' } ) }
				isShownByDefault
			>
				<SelectControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'Order' ) }
					options={ [
						{ label: __( 'Ascending' ), value: 'asc' },
						{ label: __( 'Descending' ), value: 'desc' },
					] }
					value={ query.order }
					onChange={ ( order ) => setQuery( { order } ) }
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				hasValue={ () => query.orderBy !== 'name' }
				label={ __( 'Order by' ) }
				onDeselect={ () => setQuery( { orderBy: 'name' } ) }
				isShownByDefault
			>
				<SelectControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'Order by' ) }
					options={ [
						{ label: __( 'Name' ), value: 'name' },
						{ label: __( 'Slug' ), value: 'slug' },
						{ label: __( 'Term ID' ), value: 'term_id' },
						{ label: __( 'Count' ), value: 'count' },
					] }
					value={ query.orderBy }
					onChange={ ( orderBy ) => setQuery( { orderBy } ) }
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				hasValue={ () => query.hideEmpty !== false }
				label={ __( 'Hide empty terms' ) }
				onDeselect={ () => setQuery( { hideEmpty: false } ) }
				isShownByDefault
			>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __( 'Hide empty terms' ) }
					checked={ query.hideEmpty }
					onChange={ ( hideEmpty ) => setQuery( { hideEmpty } ) }
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				hasValue={ () => query.hierarchical !== false }
				label={ __( 'Show hierarchy' ) }
				onDeselect={ () => setQuery( { hierarchical: false } ) }
				isShownByDefault
			>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __( 'Show hierarchy' ) }
					checked={ query.hierarchical }
					onChange={ ( hierarchical ) =>
						setQuery( { hierarchical } )
					}
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				hasValue={ () => query.search !== '' }
				label={ __( 'Search terms' ) }
				onDeselect={ () => setQuery( { search: '' } ) }
				isShownByDefault
			>
				<TextControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'Search terms' ) }
					value={ query.search }
					onChange={ ( search ) => setQuery( { search } ) }
				/>
			</ToolsPanelItem>
		</ToolsPanel>
	);
}
