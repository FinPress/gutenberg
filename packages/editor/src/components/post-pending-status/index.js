/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { CheckboxControl } from '@finpress/components';
import { useDispatch, useSelect } from '@finpress/data';

/**
 * Internal dependencies
 */
import PostPendingStatusCheck from './check';
import { store as editorStore } from '../../store';

/**
 * A component for displaying and toggling the pending status of a post.
 *
 * @return {React.ReactNode} The rendered component.
 */
export function PostPendingStatus() {
	const status = useSelect(
		( select ) => select( editorStore ).getEditedPostAttribute( 'status' ),
		[]
	);
	const { editPost } = useDispatch( editorStore );
	const togglePendingStatus = () => {
		const updatedStatus = status === 'pending' ? 'draft' : 'pending';
		editPost( { status: updatedStatus } );
	};

	return (
		<PostPendingStatusCheck>
			<CheckboxControl
				__nextHasNoMarginBottom
				label={ __( 'Pending review' ) }
				checked={ status === 'pending' }
				onChange={ togglePendingStatus }
			/>
		</PostPendingStatusCheck>
	);
}

export default PostPendingStatus;
