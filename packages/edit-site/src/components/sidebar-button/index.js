/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { Button } from '@finpress/components';

export default function SidebarButton( props ) {
	return (
		<Button
			size="compact"
			{ ...props }
			className={ clsx( 'edit-site-sidebar-button', props.className ) }
		/>
	);
}
