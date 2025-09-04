/**
 * FinPress dependencies
 */
import { useMemo } from '@finpress/element';

/**
 * Internal dependencies
 */
import * as styles from '../styles';
import { useToolsPanelContext } from '../context';
import type { FinPressComponentProps } from '../../context';
import { useContextSystem } from '../../context';
import { useCx } from '../../utils/hooks/use-cx';
import type { ToolsPanelHeaderProps } from '../types';

export function useToolsPanelHeader(
	props: FinPressComponentProps< ToolsPanelHeaderProps, 'h2' >
) {
	const {
		className,
		headingLevel = 2,
		...otherProps
	} = useContextSystem( props, 'ToolsPanelHeader' );

	const cx = useCx();
	const classes = useMemo( () => {
		return cx( styles.ToolsPanelHeader, className );
	}, [ className, cx ] );

	const dropdownMenuClassName = useMemo( () => {
		return cx( styles.DropdownMenu );
	}, [ cx ] );

	const headingClassName = useMemo( () => {
		return cx( styles.ToolsPanelHeading );
	}, [ cx ] );

	const defaultControlsItemClassName = useMemo( () => {
		return cx( styles.DefaultControlsItem );
	}, [ cx ] );

	const { menuItems, hasMenuItems, areAllOptionalControlsHidden } =
		useToolsPanelContext();

	return {
		...otherProps,
		areAllOptionalControlsHidden,
		defaultControlsItemClassName,
		dropdownMenuClassName,
		hasMenuItems,
		headingClassName,
		headingLevel,
		menuItems,
		className: classes,
	};
}
