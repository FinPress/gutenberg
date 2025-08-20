/**
 * External dependencies
 */
import type { MouseEventHandler } from 'react';

/**
 * WordPress dependencies
 */
import {
	Modal,
	__experimentalHStack as HStack,
	privateApis as componentsPrivateApis,
} from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import type { useRegistry } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import type { Action, ActionModal as ActionModalType } from '../../types';
import ActionsToolbar from '../actions-toolbar';

const { Menu, kebabCase } = unlock( componentsPrivateApis );

export interface ActionTriggerProps< Item > {
	action: Action< Item >;
	onClick: MouseEventHandler;
	isBusy?: boolean;
	items: Item[];
}

export interface ActionModalProps< Item > {
	action: ActionModalType< Item >;
	items: Item[];
	closeModal: () => void;
}

interface ActionsMenuGroupProps< Item > {
	actions: Action< Item >[];
	item: Item;
	registry: ReturnType< typeof useRegistry >;
	setActiveModalAction: ( action: ActionModalType< Item > | null ) => void;
}

interface ItemActionsProps< Item > {
	item: Item;
	actions: Action< Item >[];
	isCompact?: boolean;
}

function MenuItemTrigger< Item >( {
	action,
	onClick,
	items,
}: ActionTriggerProps< Item > ) {
	const label =
		typeof action.label === 'string' ? action.label : action.label( items );
	return (
		<Menu.Item disabled={ action.disabled } onClick={ onClick }>
			<Menu.ItemLabel>{ label }</Menu.ItemLabel>
		</Menu.Item>
	);
}

export function ActionModal< Item >( {
	action,
	items,
	closeModal,
}: ActionModalProps< Item > ) {
	const label =
		typeof action.label === 'string' ? action.label : action.label( items );
	return (
		<Modal
			title={ action.modalHeader || label }
			__experimentalHideHeader={ !! action.hideModalHeader }
			onRequestClose={ closeModal }
			focusOnMount={ action.modalFocusOnMount ?? true }
			size={ action.modalSize || 'medium' }
			overlayClassName={ `dataviews-action-modal dataviews-action-modal__${ kebabCase(
				action.id
			) }` }
		>
			<action.RenderModal items={ items } closeModal={ closeModal } />
		</Modal>
	);
}

export function ActionsMenuGroup< Item >( {
	actions,
	item,
	registry,
	setActiveModalAction,
}: ActionsMenuGroupProps< Item > ) {
	return (
		<Menu.Group>
			{ actions.map( ( action ) => (
				<MenuItemTrigger
					key={ action.id }
					action={ action }
					onClick={ () => {
						if ( 'RenderModal' in action ) {
							setActiveModalAction( action );
							return;
						}
						action.callback( [ item ], { registry } );
					} }
					items={ [ item ] }
				/>
			) ) }
		</Menu.Group>
	);
}

export default function ItemActions< Item >( {
	item,
	actions,
	isCompact,
}: ItemActionsProps< Item > ) {
	const { primaryActions, eligibleActions } = useMemo( () => {
		// If an action is eligible for all items, doesn't need
		// to provide the `isEligible` function.
		const _eligibleActions = actions.filter(
			( action ) => ! action.isEligible || action.isEligible( item )
		);
		const _primaryActions = _eligibleActions.filter(
			( action ) => action.isPrimary && !! action.icon
		);
		return {
			primaryActions: _primaryActions,
			eligibleActions: _eligibleActions,
		};
	}, [ actions, item ] );

	if ( isCompact ) {
		return (
			<ActionsToolbar
				actions={ eligibleActions }
				item={ item }
				variant="menu"
				size="small"
			/>
		);
	}

	// If all actions are primary, there is no need to render the dropdown.
	if ( primaryActions.length === eligibleActions.length ) {
		return <ActionsToolbar actions={ primaryActions } item={ item } />;
	}

	return (
		<HStack
			spacing={ 1 }
			justify="flex-end"
			className="dataviews-item-actions"
			style={ {
				flexShrink: 0,
				width: 'auto',
			} }
		>
			<ActionsToolbar actions={ primaryActions } item={ item } />
			<ActionsToolbar
				actions={ eligibleActions }
				item={ item }
				variant="menu"
			/>
		</HStack>
	);
}
