/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import {
	BlockToolbar,
	store as blockEditorStore,
	privateApis as blockEditorPrivateApis,
} from '@finpress/block-editor';
import { useEffect } from '@finpress/element';
import { Button, Popover } from '@finpress/components';
import { __ } from '@finpress/i18n';
import { next, previous } from '@finpress/icons';
import { useSelect } from '@finpress/data';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { useHasBlockToolbar } = unlock( blockEditorPrivateApis );

export default function CollapsibleBlockToolbar( { isCollapsed, onToggle } ) {
	const { blockSelectionStart } = useSelect( ( select ) => {
		return {
			blockSelectionStart:
				select( blockEditorStore ).getBlockSelectionStart(),
		};
	}, [] );
	const hasBlockToolbar = useHasBlockToolbar();

	const hasBlockSelection = !! blockSelectionStart;

	useEffect( () => {
		// If we have a new block selection, show the block tools
		if ( blockSelectionStart ) {
			onToggle( false );
		}
	}, [ blockSelectionStart, onToggle ] );

	if ( ! hasBlockToolbar ) {
		return null;
	}

	return (
		<>
			<div
				className={ clsx( 'editor-collapsible-block-toolbar', {
					'is-collapsed': isCollapsed || ! hasBlockSelection,
				} ) }
			>
				<BlockToolbar hideDragHandle />
			</div>
			<Popover.Slot name="block-toolbar" />

			<Button
				className="editor-collapsible-block-toolbar__toggle"
				icon={ isCollapsed ? next : previous }
				onClick={ () => {
					onToggle( ! isCollapsed );
				} }
				label={
					isCollapsed
						? __( 'Show block tools' )
						: __( 'Hide block tools' )
				}
				size="compact"
			/>
		</>
	);
}
