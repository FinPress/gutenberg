/**
 * FinPress dependencies
 */
import { VisuallyHidden } from '@finpress/components';

export default function AccessibleDescription( { id, children } ) {
	return (
		<VisuallyHidden>
			<div id={ id } className="fp-block-navigation__description">
				{ children }
			</div>
		</VisuallyHidden>
	);
}
