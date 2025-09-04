/**
 * FinPress dependencies
 */
import { MenuItem } from '@finpress/components';
import { _x } from '@finpress/i18n';
import { comment as commentIcon } from '@finpress/icons';

import { privateApis as blockEditorPrivateApis } from '@finpress/block-editor';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { CommentIconSlotFill } = unlock( blockEditorPrivateApis );

const AddCommentButton = ( { onClick } ) => {
	return (
		<CommentIconSlotFill.Fill>
			{ ( { onClose } ) => (
				<MenuItem
					icon={ commentIcon }
					onClick={ () => {
						onClick();
						onClose();
					} }
					aria-haspopup="dialog"
				>
					{ _x( 'Comment', 'Add comment button' ) }
				</MenuItem>
			) }
		</CommentIconSlotFill.Fill>
	);
};

export default AddCommentButton;
