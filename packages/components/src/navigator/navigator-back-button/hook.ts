/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { WordPressComponentProps } from '../../context';
import { useContextSystem } from '../../context';
import Button from '../../button';
import { useNavigator } from '../use-navigator';
import type { NavigatorBackButtonProps } from '../types';
import { maybeWarnDeprecated36pxSize } from '../../utils/deprecated-36px-size';

export function useNavigatorBackButton(
	props: WordPressComponentProps< NavigatorBackButtonProps, 'button' >
) {
	const {
		onClick,
		as,

		...otherProps
	} = useContextSystem( props, 'Navigator.BackButton' );

	const { goBack } = useNavigator();
	const handleClick: React.MouseEventHandler< HTMLButtonElement > =
		useCallback(
			( e ) => {
				e.preventDefault();
				goBack();
				onClick?.( e );
			},
			[ goBack, onClick ]
		);

	if ( as === undefined ) {
		maybeWarnDeprecated36pxSize( {
			componentName: 'Navigator.BackButton',
			__next40pxDefaultSize: otherProps.__next40pxDefaultSize,
			size: otherProps.size,
			hint: 'Set the `__next40pxDefaultSize` prop to true to start opting into the new default size, which will become the default in a future version. For icon buttons, consider setting a non-default size like `size: "compact"`.',
		} );
	}

	return {
		as: as ?? Button,
		__shouldNotWarnDeprecated36pxSize: as === undefined,
		onClick: handleClick,
		...otherProps,
	};
}
