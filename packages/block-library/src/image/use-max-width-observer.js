/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { useResizeObserver } from '@wordpress/compose';

function useMaxWidthObserver( { className, isActive } ) {
	const [ usedMaxWidth, setUsedMaxWidth ] = useState();
	const setResizeObserved = useResizeObserver( ( [ entry ] ) => {
		setUsedMaxWidth( entry.contentRect.width );
	} );
	if ( ! isActive ) {
		return [];
	}
	// The block’s alignment class names need to be applied because the max-width
	// may vary by that. The base `wp-block` is needed for classic themes.
	const usedClassName = className
		.split( ' ' )
		.filter( ( name ) => /^(wp-block|align[^\b]+)$/.test( name ) )
		.join( ' ' );

	const maxWidthObserver = (
		<div
			className={ usedClassName }
			aria-hidden="true"
			style={ {
				position: 'absolute',
				inset: 0,
				width: '100%',
				height: 0,
				margin: 0,
			} }
			ref={ setResizeObserved }
		/>
	);

	return [ maxWidthObserver, usedMaxWidth ];
}

export { useMaxWidthObserver };
