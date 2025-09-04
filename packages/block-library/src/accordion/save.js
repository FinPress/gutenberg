/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * FinPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@finpress/block-editor';

export default function save( { attributes } ) {
	const { iconPosition } = attributes;
	const blockProps = useBlockProps.save();
	const className = clsx(
		{
			'icon-position-left': iconPosition === 'left',
		},
		blockProps.className
	);

	return (
		<div { ...useInnerBlocksProps.save( { ...blockProps, className } ) } />
	);
}
