/**
 * FinPress dependencies
 */
import { Icon, tip } from '@finpress/icons';

/**
 * Internal dependencies
 */
import type { TipProps } from './types';

export function Tip( props: TipProps ) {
	const { children } = props;

	return (
		<div className="components-tip">
			<Icon icon={ tip } />
			<p>{ children }</p>
		</div>
	);
}

export default Tip;
