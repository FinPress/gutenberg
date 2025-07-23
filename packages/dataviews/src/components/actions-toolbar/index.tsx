/**
 * External dependencies
 */
import type { ReactElement, MouseEventHandler } from 'react';

/**
 * WordPress dependencies
 */
import { Button, __experimentalHStack as HStack } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useRegistry } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { ActionModal } from '../dataviews-item-actions';
import type { Action, ActionModal as ActionModalType } from '../../types';

interface SingleItemActionTriggerProps< Item > {
	action: Action< Item >;
	onClick: MouseEventHandler;
	isBusy?: boolean;
	item: Item;
}

function ButtonTrigger< Item >( {
	action,
	onClick,
	item,
}: SingleItemActionTriggerProps< Item > ) {
	const label =
		typeof action.label === 'string'
			? action.label
			: action.label( [ item ] );
	const getVariant = () => {
			return undefined; // Default minimal style for icons
	};

	return (
		<Button
			label={ label }
			icon={ action.icon }
			text={ undefined }
			disabled={ !! action.disabled }
			accessibleWhenDisabled
			isDestructive={ action.isDestructive }
			size="compact"
			onClick={ onClick }
		/>
	);
}

interface ActionsToolbarProps< Item > {
	actions: Action< Item >[];
	item: Item;
	className?: string;
}

/**
 * A standalone toolbar component that renders DataViews actions as a row of buttons.
 *
 * This component allows you to render DataViews actions inside and outside of the main DataViews component.
 * It handles action eligibility, modal rendering, and maintains consistency with DataViews action patterns while being independently usable.
 *
 * @param props           - Component props
 * @param props.actions   - Array of actions to render
 * @param props.item      - Item the actions will operate on
 * @param props.className - Optional CSS class name
 */
export default function ActionsToolbar< Item >( {
	actions,
	item,
	className = '',
}: ActionsToolbarProps< Item > ): ReactElement | null {
	const registry = useRegistry();
	const [ activeModalAction, setActiveModalAction ] =
		useState< ActionModalType< Item > | null >( null );

	// Filter actions that are eligible for this item
	const eligibleActions = actions.filter( ( action ) => {
		return ! action.isEligible || action.isEligible( item );
	} );

	if ( eligibleActions.length === 0 ) {
		return null;
	}

	return (
		<>
			<HStack
				justify="center"
				className={ `dataviews-actions-toolbar ${ className }` }
			>
				{ eligibleActions.map( ( action ) => (
					<ButtonTrigger
						key={ action.id }
						action={ action }
						onClick={ () => {
							if ( 'RenderModal' in action ) {
								setActiveModalAction( action );
								return;
							}
							action.callback( [ item ], { registry } );
						} }
						item={ item }
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
