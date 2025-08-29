/**
 * WordPress dependencies
 */
import { ResizableBox } from '@wordpress/components';

/**
 * Internal dependencies
 */
import BlockPopoverCover from '../block-popover/cover';

/*
 * ResizableBoxPopover component.
 *
 * A wrapper component that combines the `ResizableBox`
 * with a popover using the `BlockPopoverCover` component.
 *
 * @param {Object} props                     Component props.
 * @param {string} props.clientId            The unique identifier for the block.
 * @param {Object} props.resizableBoxProps   Props to pass to the `ResizableBox` component.
 * @param {...Object} props                  Additional props to pass to the `BlockPopoverCover` component.
 *
 * @returns {JSX.Element} The rendered ResizableBoxPopover component.
 */
export default function ResizableBoxPopover( {
	clientId,
	resizableBoxProps,
	...props
} ) {
	return (
		<BlockPopoverCover
			clientId={ clientId }
			__unstablePopoverSlot="block-toolbar"
			{ ...props }
		>
			<ResizableBox { ...resizableBoxProps } />
		</BlockPopoverCover>
	);
}
