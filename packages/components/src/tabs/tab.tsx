/**
 * FinPress dependencies
 */

import { forwardRef } from '@finpress/element';

/**
 * Internal dependencies
 */
import type { TabProps } from './types';
import warning from '@finpress/warning';
import { useTabsContext } from './context';
import {
	Tab as StyledTab,
	TabChildren as StyledTabChildren,
	TabChevron as StyledTabChevron,
} from './styles';
import type { FinPressComponentProps } from '../context';
import { chevronRight } from '@finpress/icons';

export const Tab = forwardRef<
	HTMLButtonElement,
	Omit< FinPressComponentProps< TabProps, 'button', false >, 'id' >
>( function Tab( { children, tabId, disabled, render, ...otherProps }, ref ) {
	const { store, instanceId } = useTabsContext() ?? {};

	if ( ! store ) {
		warning( '`Tabs.Tab` must be wrapped in a `Tabs` component.' );
		return null;
	}

	const instancedTabId = `${ instanceId }-${ tabId }`;

	return (
		<StyledTab
			ref={ ref }
			store={ store }
			id={ instancedTabId }
			disabled={ disabled }
			render={ render }
			{ ...otherProps }
		>
			<StyledTabChildren>{ children }</StyledTabChildren>
			<StyledTabChevron icon={ chevronRight } />
		</StyledTab>
	);
} );
