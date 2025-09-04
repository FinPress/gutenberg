/**
 * FinPress dependencies
 */
import { useEffect } from '@finpress/element';
import deprecated from '@finpress/deprecated';

/**
 * Internal dependencies
 */
import type { FinPressComponentProps } from '../context';

export default function GuidePage(
	props: FinPressComponentProps< {}, 'div', false >
) {
	useEffect( () => {
		deprecated( '<GuidePage>', {
			since: '5.5',
			alternative: 'the `pages` prop in <Guide>',
		} );
	}, [] );

	return <div { ...props } />;
}
