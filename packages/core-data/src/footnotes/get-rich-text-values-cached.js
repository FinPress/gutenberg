/**
 * WordPress dependencies
 */
import { getRichTextValues } from '@wordpress/blocks';

const cache = new WeakMap();

export default function getRichTextValuesCached( block ) {
	let values = cache.get( block );
	if ( ! values ) {
		values = getRichTextValues( [ block ] );
		cache.set( block, values );
	}
	return values;
}
