/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { useMemo, useRef, memo } from '@wordpress/element';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
	isReusableBlock,
	isTemplatePart,
} from '@wordpress/blocks';
import { __experimentalTruncate as Truncate } from '@wordpress/components';
import { ENTER, isAppleOS } from '@wordpress/keycodes';
import { useSelect } from '@wordpress/data';
import { useViewportMatch } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import BlockIcon from '../block-icon';
import { InserterListboxItem } from '../inserter-listbox';
import InserterDraggableBlocks from '../inserter-draggable-blocks';
import { store as blockEditorStore } from '../../store';
import { unlock } from '../../lock-unlock';

function InserterListItem( {
	className,
	isFirst,
	item,
	onSelect,
	onHover,
	isDraggable,
	...props
} ) {
	const isDraggingRef = useRef( false );
	const itemIconStyle = item.icon
		? {
				backgroundColor: item.icon.background,
				color: item.icon.foreground,
		  }
		: {};
	const blocks = useMemo(
		() => [
			createBlock(
				item.name,
				item.initialAttributes,
				createBlocksFromInnerBlocksTemplate( item.innerBlocks )
			),
		],
		[ item.name, item.initialAttributes, item.innerBlocks ]
	);

	const isSynced =
		( isReusableBlock( item ) && item.syncStatus !== 'unsynced' ) ||
		isTemplatePart( item );

	const { setInserterIsOpened } = useSelect( ( select ) => {
		const { getSettings } = unlock( select( blockEditorStore ) );

		return {
			setInserterIsOpened:
				getSettings().__experimentalSetIsInserterOpened,
		};
	}, [] );

	const isMobileViewport = useViewportMatch( 'medium', '<' );

	return (
		<InserterDraggableBlocks
			isEnabled={ isDraggable && ! item.isDisabled }
			blocks={ blocks }
			icon={ item.icon }
		>
			{ ( { draggable, onDragStart, onDragEnd } ) => (
				<div
					className={ clsx(
						'block-editor-block-types-list__list-item',
						{
							'is-synced': isSynced,
						}
					) }
					draggable={ draggable }
					onDragStart={ ( event ) => {
						isDraggingRef.current = true;
						if ( onDragStart ) {
							onHover( null );
							onDragStart( event );
						}
						if ( isMobileViewport ) {
							setInserterIsOpened( false );
						}
					} }
					onDragEnd={ ( event ) => {
						isDraggingRef.current = false;
						if ( onDragEnd ) {
							onDragEnd( event );
						}
					} }
				>
					<InserterListboxItem
						isFirst={ isFirst }
						className={ clsx(
							'block-editor-block-types-list__item',
							className
						) }
						disabled={ item.isDisabled }
						onClick={ ( event ) => {
							event.preventDefault();
							onSelect(
								item,
								isAppleOS() ? event.metaKey : event.ctrlKey
							);
							onHover( null );
						} }
						onKeyDown={ ( event ) => {
							const { keyCode } = event;
							if ( keyCode === ENTER ) {
								event.preventDefault();
								onSelect(
									item,
									isAppleOS() ? event.metaKey : event.ctrlKey
								);
								onHover( null );
							}
						} }
						onMouseEnter={ () => {
							if ( isDraggingRef.current ) {
								return;
							}
							onHover( item );
						} }
						onMouseLeave={ () => onHover( null ) }
						{ ...props }
					>
						<span
							className="block-editor-block-types-list__item-icon"
							style={ itemIconStyle }
						>
							<BlockIcon icon={ item.icon } showColors />
						</span>
						<span className="block-editor-block-types-list__item-title">
							<Truncate numberOfLines={ 3 }>
								{ item.title }
							</Truncate>
						</span>
					</InserterListboxItem>
				</div>
			) }
		</InserterDraggableBlocks>
	);
}

export default memo( InserterListItem );
