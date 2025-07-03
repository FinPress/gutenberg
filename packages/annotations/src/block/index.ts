/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store/constants';
import type { WPAnnotation } from '../types';

/**
 * Adds annotation className to the block-list-block component.
 *
 * @param OriginalComponent The original BlockListBlock component.
 * @return The enhanced component.
 */
const addAnnotationClassName = ( OriginalComponent: any ) => {
	return ( withSelect as any )(
		(
			select: any,
			{ clientId, className }: { clientId: string; className?: string }
		) => {
			const annotations: WPAnnotation[] =
				select( STORE_NAME ).__experimentalGetAnnotationsForBlock(
					clientId
				);

			return {
				className: annotations
					.map( ( annotation ) => {
						return 'is-annotated-by-' + annotation.source;
					} )
					.concat( className || '' )
					.filter( Boolean )
					.join( ' ' ),
			};
		}
	)( OriginalComponent );
};

addFilter(
	'editor.BlockListBlock',
	'core/annotations',
	addAnnotationClassName
);
