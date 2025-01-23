/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	__experimentalHStack as HStack,
	__experimentalTruncate as Truncate,
} from '@wordpress/components';
import { forwardRef } from '@wordpress/element';
import { SPACE, ENTER } from '@wordpress/keycodes';
import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
/**
 * Internal dependencies
 */
import BlockIcon from '../block-icon';
import useBlockDisplayInformation from '../use-block-display-information';
import useBlockDisplayTitle from '../block-title/use-block-display-title';
import ListViewExpander from './expander';
import useListViewImages from './use-list-view-images';
import { store as blockEditorStore } from '../../store';
import isEmptyString from '../block-rename/is-empty-string';
import { BlockRenameModal, useBlockRename } from '../block-rename';

function ListViewBlockSelectButton(
	{
		className,
		block: { clientId },
		onClick,
		onContextMenu,
		onMouseDown,
		onToggleExpanded,
		tabIndex,
		onFocus,
		onDragStart,
		onDragEnd,
		draggable,
		isExpanded,
		ariaDescribedBy,
	},
	ref
) {
	const { metadata } = useSelect(
		( select ) => {
			const { getBlockAttributes } = select( blockEditorStore );

			const _metadata = getBlockAttributes( clientId )?.metadata;
			return {
				metadata: _metadata,
			};
		},
		[ clientId ]
	);
	const blockInformation = useBlockDisplayInformation( clientId );
	const blockTitle = useBlockDisplayTitle( {
		clientId,
		context: 'list-view',
	} );
	const { isContentOnly } = useSelect(
		( select ) => ( {
			isContentOnly:
				select( blockEditorStore ).getBlockEditingMode( clientId ) ===
				'contentOnly',
		} ),
		[ clientId ]
	);
	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const { blockName } = useSelect(
		( select ) => {
			const { getBlockName } = select( blockEditorStore );

			return {
				isContentOnly:
					select( blockEditorStore ).getBlockEditingMode(
						clientId
					) === 'contentOnly',
				blockName: getBlockName( clientId ),
			};
		},
		[ clientId ]
	);

	// State for renaming modal
	const [ renamingBlock, setRenamingBlock ] = useState( false );
	const canRename = useBlockRename( blockName ) && ! isContentOnly;
	const onDragStartHandler = ( event ) => {
		event.dataTransfer.clearData();
		onDragStart?.( event );
	};

	function onKeyDown( event ) {
		if ( event.keyCode === ENTER || event.keyCode === SPACE ) {
			onClick( event );
		}
	}
	function onChange( newName ) {
		updateBlockAttributes( [ clientId ], {
			metadata: {
				...metadata,
				name: newName,
			},
		} );
	}
	return (
		<>
			<a
				className={ clsx(
					'block-editor-list-view-block-select-button',
					className
				) }
				onClick={ onClick }
				onContextMenu={ onContextMenu }
				onKeyDown={ onKeyDown }
				onMouseDown={ onMouseDown }
				ref={ ref }
				tabIndex={ tabIndex }
				onFocus={ onFocus }
				onDragStart={ onDragStartHandler }
				onDragEnd={ onDragEnd }
				draggable={ draggable }
				href={ `#block-${ clientId }` }
				aria-describedby={ ariaDescribedBy }
				aria-expanded={ isExpanded }
			>
				<ListViewExpander onClick={ onToggleExpanded } />
				<BlockIcon
					icon={ blockInformation?.icon }
					showColors
					context="list-view"
				/>
				<HStack
					alignment="center"
					className="block-editor-list-view-block-select-button__label-wrapper"
					justify="flex-start"
					spacing={ 1 }
				>
					<span
						className="block-editor-list-view-block-select-button__title"
						onDoubleClick={ () => {
							if ( canRename ) {
								setRenamingBlock( true );
							}
						} }
					>
						<Truncate ellipsizeMode="auto">{ blockTitle }</Truncate>
					</span>
					{ /* Additional UI Elements */ }
				</HStack>
			</a>
			{ /* Render Rename Modal */ }
			{ renamingBlock && (
				<BlockRenameModal
					blockName={ blockTitle }
					originalBlockName={ blockInformation?.title }
					onClose={ () => setRenamingBlock( false ) }
					onSave={ ( newName ) => {
						// If the new value is the block's original name (e.g. `Group`)
						// or it is an empty string then assume the intent is to reset
						// the value. Therefore reset the metadata.
						if (
							newName === blockInformation?.title ||
							isEmptyString( newName )
						) {
							newName = undefined;
						}

						onChange( newName );
					} }
				/>
			) }
		</>
	);
}

export default forwardRef( ListViewBlockSelectButton );
