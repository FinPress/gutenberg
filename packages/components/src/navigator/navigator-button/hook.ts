/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';
import { escapeAttribute } from '@wordpress/escape-html';

/**
 * Internal dependencies
 */
import type { WordPressComponentProps } from '../../context';
import { useContextSystem } from '../../context';
import Button from '../../button';
import { useNavigator } from '../use-navigator';
import type { NavigatorButtonProps } from '../types';
import { maybeWarnDeprecated36pxSize } from '../../utils/deprecated-36px-size';

const cssSelectorForAttribute = ( attrName: string, attrValue: string ) =>
	`[${ attrName }="${ attrValue }"]`;

export function useNavigatorButton(
	props: WordPressComponentProps< NavigatorButtonProps, 'button' >
) {
	const {
		path,
		onClick,
		as,
		attributeName = 'id',
		...otherProps
	} = useContextSystem( props, 'Navigator.Button' );

	const escapedPath = escapeAttribute( path );

	const { goTo } = useNavigator();
	const handleClick: React.MouseEventHandler< HTMLButtonElement > =
		useCallback(
			( e ) => {
				e.preventDefault();
				goTo( escapedPath, {
					focusTargetSelector: cssSelectorForAttribute(
						attributeName,
						escapedPath
					),
				} );
				onClick?.( e );
			},
			[ goTo, onClick, attributeName, escapedPath ]
		);

	if ( as === undefined ) {
		maybeWarnDeprecated36pxSize( {
			componentName: 'Navigator.Button',
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
		[ attributeName ]: escapedPath,
	};
}
