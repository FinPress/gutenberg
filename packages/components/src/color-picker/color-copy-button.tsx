/**
 * WordPress dependencies
 */
import { useCopyToClipboard } from '@wordpress/compose';
import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Button } from '../button';

import type { ColorCopyButtonProps } from './types';

export const ColorCopyButton = ( props: ColorCopyButtonProps ) => {
	const { color, colorType } = props;
	const [ copiedColor, setCopiedColor ] = useState< string | null >( null );
	const copyTimerRef = useRef<
		ReturnType< typeof setTimeout > | undefined
	>();
	const copyRef = useCopyToClipboard< HTMLDivElement >(
		() => {
			switch ( colorType ) {
				case 'hsl': {
					return color.toHslString();
				}
				case 'rgb': {
					return color.toRgbString();
				}
				default:
				case 'hex': {
					return color.toHex();
				}
			}
		},
		() => {
			if ( copyTimerRef.current ) {
				clearTimeout( copyTimerRef.current );
			}
			setCopiedColor( color.toHex() );
			copyTimerRef.current = setTimeout( () => {
				setCopiedColor( null );
				copyTimerRef.current = undefined;
			}, 3000 );
		}
	);
	useEffect( () => {
		// Clear copyTimerRef on component unmount.
		return () => {
			if ( copyTimerRef.current ) {
				clearTimeout( copyTimerRef.current );
			}
		};
	}, [] );

	return (
		<Button variant="secondary" ref={ copyRef } size="compact">
			{ copiedColor === color.toHex() ? __( 'Copied!' ) : __( 'Copy' ) }
		</Button>
	);
};
