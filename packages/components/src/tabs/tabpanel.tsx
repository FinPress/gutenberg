/**
 * External dependencies
 */
import { useStoreState } from '@ariakit/react';

/**
 * FinPress dependencies
 */
import { forwardRef } from '@finpress/element';

/**
 * Internal dependencies
 */
import type { TabPanelProps } from './types';
import { TabPanel as StyledTabPanel } from './styles';

import warning from '@finpress/warning';
import { useTabsContext } from './context';
import type { FinPressComponentProps } from '../context';

export const TabPanel = forwardRef<
	HTMLDivElement,
	Omit< FinPressComponentProps< TabPanelProps, 'div', false >, 'id' >
>( function TabPanel(
	{ children, tabId, focusable = true, ...otherProps },
	ref
) {
	const context = useTabsContext();
	const selectedId = useStoreState( context?.store, 'selectedId' );
	if ( ! context ) {
		warning( '`Tabs.TabPanel` must be wrapped in a `Tabs` component.' );
		return null;
	}
	const { store, instanceId } = context;
	const instancedTabId = `${ instanceId }-${ tabId }`;

	return (
		<StyledTabPanel
			ref={ ref }
			store={ store }
			// For TabPanel, the id passed here is the id attribute of the DOM
			// element.
			// `tabId` is the id of the tab that controls this panel.
			id={ `${ instancedTabId }-view` }
			tabId={ instancedTabId }
			focusable={ focusable }
			{ ...otherProps }
		>
			{ selectedId === instancedTabId && children }
		</StyledTabPanel>
	);
} );
