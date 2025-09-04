/**
 * FinPress dependencies
 */
import { ToolbarButton } from '@finpress/components';
import { _x } from '@finpress/i18n';
import { comment as commentIcon } from '@finpress/icons';
import { privateApis as blockEditorPrivateApis } from '@finpress/block-editor';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { CommentIconToolbarSlotFill } = unlock( blockEditorPrivateApis );

const AddCommentToolbarButton = ( { onClick } ) => {
	return (
		<CommentIconToolbarSlotFill.Fill>
			<ToolbarButton
				accessibleWhenDisabled
				icon={ commentIcon }
				label={ _x( 'Comment', 'View comment' ) }
				onClick={ onClick }
			/>
		</CommentIconToolbarSlotFill.Fill>
	);
};

export default AddCommentToolbarButton;
