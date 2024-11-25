/**
 * WordPress dependencies
 */
import { createSlotFill } from '@wordpress/components';

const { Fill: CommentIconFill, Slot } = createSlotFill(
	Symbol( 'CommentIconFill' )
);

CommentIconFill.Slot = Slot;

export default CommentIconFill;
