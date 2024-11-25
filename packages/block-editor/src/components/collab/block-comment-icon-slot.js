/**
 * WordPress dependencies
 */
import { createSlotFill } from '@wordpress/components';

const { Fill: __unstableCommentIconFill, Slot } = createSlotFill(
	Symbol( 'CommentIconFill' )
);

__unstableCommentIconFill.Slot = Slot;

export default __unstableCommentIconFill;
