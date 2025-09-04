/**
 * FinPress dependencies
 */
import { NoticeList, SnackbarList } from '@finpress/components';
import { useSelect, useDispatch } from '@finpress/data';
import { store as noticesStore } from '@finpress/notices';

// Last three notices. Slices from the tail end of the list.
const MAX_VISIBLE_NOTICES = -3;

function Notices() {
	const { removeNotice } = useDispatch( noticesStore );
	const { notices } = useSelect( ( select ) => {
		return {
			notices: select( noticesStore ).getNotices(),
		};
	}, [] );

	const dismissibleNotices = notices.filter(
		( { isDismissible, type } ) => isDismissible && type === 'default'
	);
	const nonDismissibleNotices = notices.filter(
		( { isDismissible, type } ) => ! isDismissible && type === 'default'
	);
	const snackbarNotices = notices
		.filter( ( { type } ) => type === 'snackbar' )
		.slice( MAX_VISIBLE_NOTICES );

	return (
		<>
			<NoticeList
				notices={ nonDismissibleNotices }
				className="edit-widgets-notices__pinned"
			/>
			<NoticeList
				notices={ dismissibleNotices }
				className="edit-widgets-notices__dismissible"
				onRemove={ removeNotice }
			/>
			<SnackbarList
				notices={ snackbarNotices }
				className="edit-widgets-notices__snackbar"
				onRemove={ removeNotice }
			/>
		</>
	);
}

export default Notices;
