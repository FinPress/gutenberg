/**
 * External dependencies
 */
import type { ReactElement, MouseEventHandler } from 'react';

/**
 * WordPress dependencies
 */
import {
	Button,
	__experimentalHStack as HStack,
	privateApis as componentsPrivateApis,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useRegistry } from '@wordpress/data';
import { moreVertical } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import { ActionModal } from '../dataviews-item-actions';
import type { Action, ActionModal as ActionModalType } from '../../types';

const { Menu } = unlock( componentsPrivateApis );

interface SingleItemActionTriggerProps< Item > {
	action: Action< Item >;
	onClick: MouseEventHandler;
	isBusy?: boolean;
	item: Item;
	showLabels?: boolean;
}

function ButtonTrigger< Item >( {
	action,
	onClick,
	item,
	showLabels = false,
}: SingleItemActionTriggerProps< Item > ) {
	const label =
		typeof action.label === 'string'
			? action.label
			: action.label( [ item ] );
	const getVariant = () => {
		if ( ! showLabels ) {
			return undefined; // Default minimal style for icons
		}
		return action.isPrimary ? 'primary' : 'secondary';
	};

	return (
		<Button
			label={ label }
			icon={ showLabels ? undefined : action.icon }
			text={ showLabels ? label : undefined }
			disabled={ !! action.disabled }
			accessibleWhenDisabled
			isDestructive={ action.isDestructive }
			variant={ getVariant() }
			size={ showLabels ? 'default' : 'compact' }
			onClick={ onClick }
		/>
	);
}

function MenuItemTrigger< Item >( {
	action,
	onClick,
	item,
}: SingleItemActionTriggerProps< Item > ) {
	const label =
		typeof action.label === 'string'
			? action.label
			: action.label( [ item ] );
	return (
		<Menu.Item disabled={ action.disabled } onClick={ onClick }>
			<Menu.ItemLabel>{ label }</Menu.ItemLabel>
		</Menu.Item>
	);
}

interface ActionsToolbarProps< Item > {
	actions: Action< Item >[];
	item: Item;
	className?: string;
	showLabels?: boolean;
	variant?: 'toolbar' | 'menu';
	size?: 'small' | 'compact';
}

/**
 * A standalone toolbar component that renders DataViews actions as buttons or menu items.
 *
 * This component allows you to render DataViews actions inside and outside of the main DataViews component.
 * It handles action eligibility, modal rendering, and maintains consistency with DataViews action patterns while being independently usable.
 *
 * @param props            - Component props
 * @param props.actions    - Array of actions to render
 * @param props.item       - Item the actions will operate on
 * @param props.className  - Optional CSS class name
 * @param props.showLabels - Whether to show text labels instead of icons (default: false, only applies to toolbar variant)
 * @param props.variant    - Rendering style: 'toolbar' for horizontal buttons, 'menu' for dropdown (default: 'toolbar')
 * @param props.size       - Button size: 'small', 'compact', or undefined for default (menu variant only)
 */
export default function ActionsToolbar< Item >( {
	actions,
	item,
	className = '',
	showLabels = false,
	variant = 'toolbar',
	size,
}: ActionsToolbarProps< Item > ): ReactElement | null {
	const registry = useRegistry();
	const [ activeModalAction, setActiveModalAction ] =
		useState< ActionModalType< Item > | null >( null );

	// Filter actions that are eligible for this item
	const eligibleActions = actions.filter( ( action ) => {
		return ! action.isEligible || action.isEligible( item );
	} );

	if ( eligibleActions.length === 0 ) {
		// For toolbar variant, return null when no actions
		// For menu variant, render disabled button to maintain consistent UI
		if ( variant === 'toolbar' ) {
			return null;
		}
	}

	const handleActionClick = ( action: Action< Item > ) => {
		if ( 'RenderModal' in action ) {
			setActiveModalAction( action );
			return;
		}
		action.callback( [ item ], { registry } );
	};

	if ( variant === 'menu' ) {
		return (
			<>
				<Menu placement="bottom-end">
					<Menu.TriggerButton
						render={
							<Button
								size={ size }
								icon={ moreVertical }
								label={ __( 'Actions' ) }
								accessibleWhenDisabled
								disabled={ eligibleActions.length === 0 }
								className={ `actions-toolbar-menu-trigger ${ className }` }
							/>
						}
					/>
					<Menu.Popover>
						<Menu.Group>
							{ eligibleActions.map( ( action ) => (
								<MenuItemTrigger
									key={ action.id }
									action={ action }
									onClick={ () =>
										handleActionClick( action )
									}
									item={ item }
								/>
							) ) }
						</Menu.Group>
					</Menu.Popover>
				</Menu>
				{ !! activeModalAction && (
					<ActionModal
						action={ activeModalAction }
						items={ [ item ] }
						closeModal={ () => setActiveModalAction( null ) }
					/>
				) }
			</>
		);
	}

	return (
		<>
			<HStack
				justify="center"
				className={ `actions-toolbar ${ className }` }
			>
				{ eligibleActions.map( ( action ) => (
					<ButtonTrigger
						key={ action.id }
						action={ action }
						onClick={ () => handleActionClick( action ) }
						item={ item }
						showLabels={ showLabels }
					/>
				) ) }
			</HStack>
			{ !! activeModalAction && (
				<ActionModal
					action={ activeModalAction }
					items={ [ item ] }
					closeModal={ () => setActiveModalAction( null ) }
				/>
			) }
		</>
	);
}

export type { ActionsToolbarProps };
