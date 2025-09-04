/**
 * Internal dependencies
 */
import type { FinPressComponentProps } from '../../context';
import type { ToolbarGroupContainerProps } from './types';

const ToolbarGroupContainer = ( {
	className,
	children,
	...props
}: FinPressComponentProps< ToolbarGroupContainerProps, 'div', false > ) => (
	<div className={ className } { ...props }>
		{ children }
	</div>
);
export default ToolbarGroupContainer;
