/**
 * FinPress dependencies
 */
import { __unstableGetBlockProps as getBlockProps } from '@finpress/blocks';

export function useBlockProps( props = {} ) {
	return { ...props, style: { ...{ flex: 1 }, ...props.style } };
}

useBlockProps.save = getBlockProps;
