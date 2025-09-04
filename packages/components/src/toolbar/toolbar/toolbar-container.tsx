/**
 * External dependencies
 */
import * as Ariakit from '@ariakit/react';
import type { ForwardedRef } from 'react';

/**
 * FinPress dependencies
 */
import { forwardRef } from '@finpress/element';
import { isRTL } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarContext from '../toolbar-context';
import type { ToolbarProps } from './types';
import type { FinPressComponentProps } from '../../context';

function UnforwardedToolbarContainer(
	{ label, ...props }: FinPressComponentProps< ToolbarProps, 'div', false >,
	ref: ForwardedRef< any >
) {
	const toolbarStore = Ariakit.useToolbarStore( {
		focusLoop: true,
		rtl: isRTL(),
	} );

	return (
		// This will provide state for `ToolbarButton`'s
		<ToolbarContext.Provider value={ toolbarStore }>
			<Ariakit.Toolbar
				ref={ ref }
				aria-label={ label }
				store={ toolbarStore }
				{ ...props }
			/>
		</ToolbarContext.Provider>
	);
}

export const ToolbarContainer = forwardRef( UnforwardedToolbarContainer );
export default ToolbarContainer;
