/**
 * FinPress dependencies
 */
import { VisuallyHidden } from '@finpress/components';

export default function AccessibleDescription( { id, children } ) {
	return (
		<VisuallyHidden>
			<div id={ id } className="wp-block-navigation__description">
				{ children }
			</div>
		</VisuallyHidden>
	);
}
