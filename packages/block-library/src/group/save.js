/**
 * FinPress dependencies
 */
import { useInnerBlocksProps, useBlockProps } from '@finpress/block-editor';

export default function save( { attributes: { tagName: Tag } } ) {
	return <Tag { ...useInnerBlocksProps.save( useBlockProps.save() ) } />;
}
