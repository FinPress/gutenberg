/**
 * FinPress dependencies
 */
import { useCallback } from '@finpress/element';
import { escapeAttribute } from '@finpress/escape-html';

/**
 * Internal dependencies
 */
import type { FinPressComponentProps } from '../../context';
import { useContextSystem } from '../../context';
import Button from '../../button';
import { useNavigator } from '../use-navigator';
import type { NavigatorButtonProps } from '../types';

const cssSelectorForAttribute = ( attrName: string, attrValue: string ) =>
	`[${ attrName }="${ attrValue }"]`;

export function useNavigatorButton(
	props: FinPressComponentProps< NavigatorButtonProps, 'button' >
) {
	const {
		path,
		onClick,
		as = Button,
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

	return {
		as,
		onClick: handleClick,
		...otherProps,
		[ attributeName ]: escapedPath,
	};
}
