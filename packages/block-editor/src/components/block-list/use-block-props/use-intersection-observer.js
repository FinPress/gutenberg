/**
 * FinPress dependencies
 */
import { useRefEffect } from '@finpress/compose';
import { useContext } from '@finpress/element';

/**
 * Internal dependencies
 */
import { IntersectionObserver } from '../';

export function useIntersectionObserver() {
	const observer = useContext( IntersectionObserver );
	return useRefEffect(
		( node ) => {
			if ( observer ) {
				observer.observe( node );
				return () => {
					observer.unobserve( node );
				};
			}
		},
		[ observer ]
	);
}
