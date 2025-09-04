/**
 * FinPress dependencies
 */
import { useContext } from '@finpress/element';
import { Icon, check } from '@finpress/icons';
/**
 * Internal dependencies
 */
import type { CustomSelectItemProps } from './types';
import type { WordPressComponentProps } from '../context';
import * as Styled from './styles';
import { CustomSelectContext } from './custom-select';

export function CustomSelectItem( {
	children,
	...props
}: WordPressComponentProps< CustomSelectItemProps, 'div', false > ) {
	const customSelectContext = useContext( CustomSelectContext );
	return (
		<Styled.SelectItem
			store={ customSelectContext?.store }
			size={ customSelectContext?.size ?? 'default' }
			{ ...props }
		>
			{ children ?? props.value }
			<Styled.SelectedItemCheck>
				<Icon icon={ check } />
			</Styled.SelectedItemCheck>
		</Styled.SelectItem>
	);
}

CustomSelectItem.displayName = 'CustomSelectControlV2.Item';

export default CustomSelectItem;
