/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { cloneBlock, parse } from '@wordpress/blocks';
import { useMemo, useId, useState } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import {
	Composite,
	VisuallyHidden,
	Tooltip,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { Icon, symbol } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { useGlobalStyle } from '../global-styles/hooks';
import BlockPreview from '../block-preview';
import InserterDraggableBlocks from '../inserter-draggable-blocks';
import { INSERTER_PATTERN_TYPES } from '../inserter/block-patterns-tab/utils';

const PATTERN_SYNC_TYPES = {
	full: 'fully',
	unsynced: 'unsynced',
};
const SYNC_FILTERS = [
	{
		value: PATTERN_SYNC_TYPES.full,
		label: _x( 'Synced', 'pattern (singular)' ),
		description: __( 'Patterns that are kept in sync across the site.' ),
	},
	{
		value: PATTERN_SYNC_TYPES.unsynced,
		label: _x( 'Not synced', 'pattern (singular)' ),
		description: __(
			'Patterns that can be changed freely without affecting the site.'
		),
	},
];

const PATTERN_SOURCE_MENU_OPTIONS = [
	{
		value: INSERTER_PATTERN_TYPES.directory,
		label: __( 'Pattern Directory' ),
	},
	{
		value: INSERTER_PATTERN_TYPES.theme,
		label: __( 'Theme & Plugins' ),
	},
	{
		value: INSERTER_PATTERN_TYPES.user,
		label: __( 'User' ),
	},
];

function getPatternSyncStatus( { item } ) {
	return item.type !== INSERTER_PATTERN_TYPES.user
		? PATTERN_SYNC_TYPES.unsynced
		: item.syncStatus || PATTERN_SYNC_TYPES.full;
}

function getItemTitle( item ) {
	if ( typeof item.title === 'string' ) {
		return decodeEntities( item.title );
	}
	if ( item.title && 'rendered' in item.title ) {
		return decodeEntities( item.title.rendered );
	}
	if ( item.title && 'raw' in item.title ) {
		return decodeEntities( item.title.raw );
	}
	return '';
}
const WithToolTip = ( { showTooltip, title, children } ) => {
	if ( showTooltip ) {
		return <Tooltip text={ title }>{ children }</Tooltip>;
	}
	return <>{ children }</>;
};
function BlockPatternPlaceholder() {
	return (
		<div className="block-editor-block-patterns-list__item is-placeholder" />
	);
}
function FieldWrapper( { item, isSelected, children } ) {
	const [ isDragging, setIsDragging ] = useState( false );
	const { blocks, isDraggable, onHover, onClick, selectedCategory } = item;
	const instanceId = useInstanceId( FieldWrapper );
	const descriptionId = `block-editor-block-patterns-list__item-description-${ instanceId }`;

	// When we have a selected category and the pattern is draggable, we need to update the
	// pattern's categories in metadata to only contain the selected category, and pass this to
	// InserterDraggableBlocks component. We do that because we use this information for pattern
	// shuffling and it makes more sense to show only the ones from the initially selected category during insertion.
	const patternBlocks = useMemo( () => {
		if ( ! selectedCategory || ! isDraggable ) {
			return blocks;
		}
		return ( blocks ?? [] ).map( ( block ) => {
			const clonedBlock = cloneBlock( block );
			if (
				clonedBlock.attributes.metadata?.categories?.includes(
					selectedCategory
				)
			) {
				clonedBlock.attributes.metadata.categories = [
					selectedCategory,
				];
			}
			return clonedBlock;
		} );
	}, [ blocks, isDraggable, selectedCategory ] );

	return (
		<InserterDraggableBlocks
			isEnabled={ isDraggable }
			blocks={ patternBlocks }
			pattern={ item }
		>
			{ ( { draggable, onDragStart, onDragEnd } ) => (
				<div
					className="block-editor-block-patterns-list__list-item"
					style={ { height: '100%' } }
					draggable={ draggable }
					onDragStart={ ( event ) => {
						setIsDragging( true );
						if ( onDragStart ) {
							onHover?.( null );
							onDragStart( event );
						}
					} }
					onDragEnd={ ( event ) => {
						setIsDragging( false );
						if ( onDragEnd ) {
							onDragEnd( event );
						}
					} }
				>
					<div
						tabIndex="0"
						role="button"
						aria-label={ item.title }
						aria-describedby={
							item.description ? descriptionId : undefined
						}
						className={ clsx(
							'block-editor-block-patterns-list__item',
							{
								'block-editor-block-patterns-list__list-item-synced':
									item.type === INSERTER_PATTERN_TYPES.user &&
									! item.syncStatus,
								'is-selected': isSelected,
							}
						) }
						id={ item.name }
						// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
						onClick={ () => {
							onClick( item, blocks );
							onHover?.( null );
						} }
						onKeyDown={ ( event ) => {
							if ( [ 'Enter', 'Space' ].includes( event.key ) ) {
								onClick( item, blocks );
								onHover?.( null );
							}
						} }
						onMouseEnter={ () => {
							if ( isDragging ) {
								return;
							}
							onHover?.( item );
						} }
						onMouseLeave={ () => onHover?.( null ) }
					>
						{ children }
					</div>
				</div>
			) }
		</InserterDraggableBlocks>
	);
}

function PreviewField( { item } ) {
	const descriptionId = useId();
	// TODO: check below description..
	const description = item.description || item?.excerpt?.raw;
	const [ backgroundColor ] = useGlobalStyle( 'color.background' );

	const blocks = useMemo( () => {
		return (
			item.blocks ??
			parse( item.content, {
				__unstableSkipMigrationLogs: true,
			} )
		);
	}, [ item?.content, item.blocks ] );
	const isEmpty = ! item.blocks?.length;

	return (
		<WithToolTip
			showTooltip={
				item.showTitlesAsTooltip &&
				item.type !== INSERTER_PATTERN_TYPES.user
			}
			title={ getItemTitle( item ) }
		>
			<div
				className="page-patterns-preview-field"
				style={ { backgroundColor } }
			>
				<div className="page-patterns-preview-field__button">
					{ isEmpty && __( 'Empty pattern' ) }
					{ ! isEmpty && (
						<BlockPreview.Async
							placeholder={ <BlockPatternPlaceholder /> }
						>
							<BlockPreview
								blocks={ blocks }
								viewportWidth={ item.viewportWidth }
							/>
						</BlockPreview.Async>
					) }
				</div>
				{ !! description && (
					<div hidden id={ descriptionId }>
						{ description }
					</div>
				) }
			</div>
		</WithToolTip>
	);
}

export const previewField = {
	label: __( 'Preview' ),
	id: 'preview',
	render: ( { item } ) => (
		<FieldWrapper item={ item }>
			<PreviewField item={ item } />
		</FieldWrapper>
	),
	enableSorting: false,
	enableHiding: false,
};
export const titleField = {
	type: 'text',
	id: 'title',
	label: __( 'Title' ),
	placeholder: __( 'No title' ),
	getValue: ( { item } ) => getItemTitle( item ),
	render: ( { item } ) => (
		<FieldWrapper item={ item }>
			<div className="block-editor-block-patterns-list__item-title">
				{ getItemTitle( item ) }
			</div>
		</FieldWrapper>
	),
	enableGlobalSearch: true,
	enableSorting: false,
};
export const syncStatusField = {
	label: __( 'Sync status' ),
	id: 'sync-status',
	getValue: getPatternSyncStatus,
	render: ( { item } ) => {
		const syncStatus = getPatternSyncStatus( { item } );
		return (
			<FieldWrapper item={ item }>
				{
					SYNC_FILTERS.find( ( { value } ) => value === syncStatus )
						.label
				}
			</FieldWrapper>
		);
	},
	elements: SYNC_FILTERS,
	filterBy: {
		operators: [ 'is' ],
	},
	enableSorting: false,
};
export const sourceField = {
	type: 'text',
	id: 'source',
	label: __( 'Source' ),
	getValue: ( { item } ) => item.source,
	render: ( { item } ) => (
		// Probably more custom logic here, like the filtering logic.
		<FieldWrapper item={ item }>{ item.source }</FieldWrapper>
	),
	elements: PATTERN_SOURCE_MENU_OPTIONS,
	filterBy: {
		operators: [ 'is' ],
	},
	enableSorting: false,
};
