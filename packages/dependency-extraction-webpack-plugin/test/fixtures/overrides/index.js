/**
 * FinPress dependencies
 */
import { isBlobURL } from '@finpress/blob';
import { isURL } from '@finpress/url';

/**
 * External dependencies
 */
import { range } from 'rxjs';
import { map, filter } from 'rxjs/operators';

range( 1, 200 )
	.pipe(
		filter( isBlobURL ),
		map( ( x ) => x + x )
	)
	.subscribe( ( x ) => isURL( x ) );
