/**
 * External dependencies
 */
import type { ChangeEvent } from 'react';

/**
 * WordPress dependencies
 */
import {
	Button,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
	Dropdown,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	SelectControl,
	__experimentalItemGroup as ItemGroup,
	__experimentalItem as Item,
	__experimentalGrid as Grid,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
	__experimentalHeading as Heading,
	__experimentalText as Text,
	privateApis as componentsPrivateApis,
	BaseControl,
} from '@wordpress/components';
import { __, _x, sprintf } from '@wordpress/i18n';
import { memo, useContext, useMemo } from '@wordpress/element';
import { chevronDown, chevronUp, cog, seen, unseen } from '@wordpress/icons';
import warning from '@wordpress/warning';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import {
	SORTING_DIRECTIONS,
	LAYOUT_TABLE,
	sortIcons,
	sortLabels,
} from '../../constants';
import { VIEW_LAYOUTS } from '../../dataviews-layouts';
import type { NormalizedField, SupportedLayouts, View } from '../../types';
import DataViewsContext from '../dataviews-context';
import { unlock } from '../../lock-unlock';

const { Menu } = unlock( componentsPrivateApis );

interface ViewTypeMenuProps {
	defaultLayouts?: SupportedLayouts;
}

const DATAVIEWS_CONFIG_POPOVER_PROPS = { placement: 'bottom-end', offset: 9 };

function ViewTypeMenu( {
	defaultLayouts = { list: {}, grid: {}, table: {} },
}: ViewTypeMenuProps ) {
	const { view, onChangeView } = useContext( DataViewsContext );
	const availableLayouts = Object.keys( defaultLayouts );
	if ( availableLayouts.length <= 1 ) {
		return null;
	}
	const activeView = VIEW_LAYOUTS.find( ( v ) => view.type === v.type );
	return (
		<Menu
			trigger={
				<Button
					size="compact"
					icon={ activeView?.icon }
					label={ __( 'Layout' ) }
				/>
			}
		>
			{ availableLayouts.map( ( layout ) => {
				const config = VIEW_LAYOUTS.find( ( v ) => v.type === layout );
				if ( ! config ) {
					return null;
				}
				return (
					<Menu.RadioItem
						key={ layout }
						value={ layout }
						name="view-actions-available-view"
						checked={ layout === view.type }
						hideOnClick
						onChange={ ( e: ChangeEvent< HTMLInputElement > ) => {
							switch ( e.target.value ) {
								case 'list':
								case 'grid':
								case 'table':
									// @ts-expect-error
									return onChangeView( {
										...view,
										type: e.target.value,
										...defaultLayouts[ e.target.value ],
									} );
							}
							warning( 'Invalid dataview' );
						} }
					>
						<Menu.ItemLabel>{ config.label }</Menu.ItemLabel>
					</Menu.RadioItem>
				);
			} ) }
		</Menu>
	);
}

function SortFieldControl() {
	const { view, fields, onChangeView } = useContext( DataViewsContext );
	const orderOptions = useMemo( () => {
		const sortableFields = fields.filter(
			( field ) => field.enableSorting !== false
		);
		return sortableFields.map( ( field ) => {
			return {
				label: field.label,
				value: field.id,
			};
		} );
	}, [ fields ] );

	return (
		<SelectControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			label={ __( 'Sort by' ) }
			value={ view.sort?.field }
			options={ orderOptions }
			onChange={ ( value: string ) => {
				onChangeView( {
					...view,
					sort: {
						direction: view?.sort?.direction || 'desc',
						field: value,
					},
				} );
			} }
		/>
	);
}

function SortDirectionControl() {
	const { view, fields, onChangeView } = useContext( DataViewsContext );

	const sortableFields = fields.filter(
		( field ) => field.enableSorting !== false
	);
	if ( sortableFields.length === 0 ) {
		return null;
	}

	let value = view.sort?.direction;
	if ( ! value && view.sort?.field ) {
		value = 'desc';
	}
	return (
		<ToggleGroupControl
			className="dataviews-view-config__sort-direction"
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			isBlock
			label={ __( 'Order' ) }
			value={ value }
			onChange={ ( newDirection ) => {
				if ( newDirection === 'asc' || newDirection === 'desc' ) {
					onChangeView( {
						...view,
						sort: {
							direction: newDirection,
							field:
								view.sort?.field ||
								// If there is no field assigned as the sorting field assign the first sortable field.
								fields.find(
									( field ) => field.enableSorting !== false
								)?.id ||
								'',
						},
					} );
					return;
				}
				warning( 'Invalid direction' );
			} }
		>
			{ SORTING_DIRECTIONS.map( ( direction ) => {
				return (
					<ToggleGroupControlOptionIcon
						key={ direction }
						value={ direction }
						icon={ sortIcons[ direction ] }
						label={ sortLabels[ direction ] }
					/>
				);
			} ) }
		</ToggleGroupControl>
	);
}

const PAGE_SIZE_VALUES = [ 10, 20, 50, 100 ];
function ItemsPerPageControl() {
	const { view, onChangeView } = useContext( DataViewsContext );
	return (
		<ToggleGroupControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			isBlock
			label={ __( 'Items per page' ) }
			value={ view.perPage || 10 }
			disabled={ ! view?.sort?.field }
			onChange={ ( newItemsPerPage ) => {
				const newItemsPerPageNumber =
					typeof newItemsPerPage === 'number' ||
					newItemsPerPage === undefined
						? newItemsPerPage
						: parseInt( newItemsPerPage, 10 );
				onChangeView( {
					...view,
					perPage: newItemsPerPageNumber,
					page: 1,
				} );
			} }
		>
			{ PAGE_SIZE_VALUES.map( ( value ) => {
				return (
					<ToggleGroupControlOption
						key={ value }
						value={ value }
						label={ value.toString() }
					/>
				);
			} ) }
		</ToggleGroupControl>
	);
}

function FieldItem( {
	index,
	field,
	view,
	onChangeView,
}: {
	index?: number;
	field: NormalizedField< any >;
	view: View;
	onChangeView: ( view: View ) => void;
} ) {
	const visibleFieldIds = view.fields ?? [];
	const isVisible =
		index !== undefined && visibleFieldIds.includes( field.id );

	return (
		<Item key={ field.id }>
			<HStack
				expanded
				className={ `dataviews-field-control__field dataviews-field-control__field-${ field.id }` }
			>
				<span>{ field.label }</span>
				<HStack
					justify="flex-end"
					expanded={ false }
					className="dataviews-field-control__actions"
				>
					{ view.type === LAYOUT_TABLE && isVisible && (
						<>
							<Button
								disabled={ index < 1 }
								accessibleWhenDisabled
								size="compact"
								onClick={ () => {
									onChangeView( {
										...view,
										fields: [
											...( visibleFieldIds.slice(
												0,
												index - 1
											) ?? [] ),
											field.id,
											visibleFieldIds[ index - 1 ],
											...visibleFieldIds.slice(
												index + 1
											),
										],
									} );
								} }
								icon={ chevronUp }
								label={ sprintf(
									/* translators: %s: field label */
									__( 'Move %s up' ),
									field.label
								) }
							/>
							<Button
								disabled={ index >= visibleFieldIds.length - 1 }
								accessibleWhenDisabled
								size="compact"
								onClick={ () => {
									onChangeView( {
										...view,
										fields: [
											...( visibleFieldIds.slice(
												0,
												index
											) ?? [] ),
											visibleFieldIds[ index + 1 ],
											field.id,
											...visibleFieldIds.slice(
												index + 2
											),
										],
									} );
								} }
								icon={ chevronDown }
								label={ sprintf(
									/* translators: %s: field label */
									__( 'Move %s down' ),
									field.label
								) }
							/>{ ' ' }
						</>
					) }
					<Button
						className="dataviews-field-control__field-visibility-button"
						disabled={ ! field.enableHiding }
						accessibleWhenDisabled
						size="compact"
						onClick={ () => {
							onChangeView( {
								...view,
								fields: isVisible
									? visibleFieldIds.filter(
											( fieldId ) => fieldId !== field.id
									  )
									: [ ...visibleFieldIds, field.id ],
							} );
							// Focus the visibility button to avoid focus loss.
							// Our code is safe against the component being unmounted, so we don't need to worry about cleaning the timeout.
							// eslint-disable-next-line @wordpress/react-no-unsafe-timeout
							setTimeout( () => {
								const element = document.querySelector(
									`.dataviews-field-control__field-${ field.id } .dataviews-field-control__field-visibility-button`
								);
								if ( element instanceof HTMLElement ) {
									element.focus();
								}
							}, 50 );
						} }
						icon={ isVisible ? unseen : seen }
						label={
							isVisible
								? sprintf(
										/* translators: %s: field label */
										_x( 'Hide %s', 'field' ),
										field.label
								  )
								: sprintf(
										/* translators: %s: field label */
										_x( 'Show %s', 'field' ),
										field.label
								  )
						}
					/>
				</HStack>
			</HStack>
		</Item>
	);
}

function isDefined< T >( item: T | undefined ): item is T {
	return !! item;
}

function FieldControl() {
	const { view, fields, onChangeView } = useContext( DataViewsContext );

	const togglableFields = [
		view?.titleField,
		view?.mediaField,
		view?.descriptionField,
	].filter( Boolean );
	const visibleFieldIds = view.fields ?? [];
	const hiddenFields = fields.filter(
		( f ) =>
			! visibleFieldIds.includes( f.id ) &&
			! togglableFields.includes( f.id )
	);
	const visibleFields = visibleFieldIds
		.map( ( fieldId ) => fields.find( ( f ) => f.id === fieldId ) )
		.filter( isDefined );

	if ( ! visibleFields?.length && ! hiddenFields?.length ) {
		return null;
	}

	return (
		<VStack spacing={ 6 } className="dataviews-field-control">
			{ !! visibleFields?.length && (
				<ItemGroup isBordered isSeparated>
					{ visibleFields.map( ( field, index ) => (
						<FieldItem
							key={ field.id }
							field={ field }
							view={ view }
							onChangeView={ onChangeView }
							index={ index }
						/>
					) ) }
				</ItemGroup>
			) }
			{ !! hiddenFields?.length && (
				<>
					<VStack spacing={ 4 }>
						<BaseControl.VisualLabel style={ { margin: 0 } }>
							{ __( 'Hidden' ) }
						</BaseControl.VisualLabel>
						<ItemGroup isBordered isSeparated>
							{ hiddenFields.map( ( field ) => (
								<FieldItem
									key={ field.id }
									field={ field }
									view={ view }
									onChangeView={ onChangeView }
								/>
							) ) }
						</ItemGroup>
					</VStack>
				</>
			) }
		</VStack>
	);
}

function SettingsSection( {
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
} ) {
	return (
		<Grid columns={ 12 } className="dataviews-settings-section" gap={ 4 }>
			<div className="dataviews-settings-section__sidebar">
				<Heading
					level={ 2 }
					className="dataviews-settings-section__title"
				>
					{ title }
				</Heading>
				{ description && (
					<Text
						variant="muted"
						className="dataviews-settings-section__description"
					>
						{ description }
					</Text>
				) }
			</div>
			<Grid
				columns={ 8 }
				gap={ 4 }
				className="dataviews-settings-section__content"
			>
				{ children }
			</Grid>
		</Grid>
	);
}

function DataviewsViewConfigDropdown() {
	const { view } = useContext( DataViewsContext );
	const popoverId = useInstanceId(
		_DataViewsViewConfig,
		'dataviews-view-config-dropdown'
	);
	const activeLayout = VIEW_LAYOUTS.find(
		( layout ) => layout.type === view.type
	);
	return (
		<Dropdown
			popoverProps={ {
				...DATAVIEWS_CONFIG_POPOVER_PROPS,
				id: popoverId,
			} }
			renderToggle={ ( { onToggle, isOpen } ) => {
				return (
					<Button
						size="compact"
						icon={ cog }
						label={ _x( 'View options', 'View is used as a noun' ) }
						onClick={ onToggle }
						aria-expanded={ isOpen ? 'true' : 'false' }
						aria-controls={ popoverId }
					/>
				);
			} }
			renderContent={ () => (
				<DropdownContentWrapper paddingSize="medium">
					<VStack className="dataviews-view-config" spacing={ 6 }>
						<SettingsSection title={ __( 'Appearance' ) }>
							<HStack expanded className="is-divided-in-two">
								<SortFieldControl />
								<SortDirectionControl />
							</HStack>
							{ !! activeLayout?.viewConfigOptions && (
								<activeLayout.viewConfigOptions />
							) }
							<ItemsPerPageControl />
						</SettingsSection>
						<SettingsSection title={ __( 'Properties' ) }>
							<FieldControl />
						</SettingsSection>
					</VStack>
				</DropdownContentWrapper>
			) }
		/>
	);
}

function _DataViewsViewConfig( {
	defaultLayouts = { list: {}, grid: {}, table: {} },
}: {
	defaultLayouts?: SupportedLayouts;
} ) {
	return (
		<>
			<ViewTypeMenu defaultLayouts={ defaultLayouts } />
			<DataviewsViewConfigDropdown />
		</>
	);
}

const DataViewsViewConfig = memo( _DataViewsViewConfig );

export default DataViewsViewConfig;
