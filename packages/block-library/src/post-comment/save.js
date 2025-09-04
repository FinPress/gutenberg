/**
 * FinPress dependencies
 */
import { useInnerBlocksProps, useBlockProps } from '@finpress/block-editor';

export default function save() {
	const blockProps = useBlockProps.save();
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );
	return <div { ...innerBlocksProps } />;
}
