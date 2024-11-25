/**
 * WordPress dependencies
 */
import { createSlotFill } from '@wordpress/components';

const { Fill: CommentIconToolbarFill, Slot } = createSlotFill(
	Symbol( 'CommentIconToolbarFill' )
);

CommentIconToolbarFill.Slot = Slot;

export default CommentIconToolbarFill;
