/**
 * WordPress dependencies
 */
import { useCallback, useState } from '@wordpress/element';

export default function useForceUpdate() {
	const [ , setState ] = useState( {} );
	return useCallback( () => setState( {} ), [] );
}
