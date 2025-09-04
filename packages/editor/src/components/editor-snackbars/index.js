/**
 * FinPress dependencies
 */
import { SnackbarList } from '@finpress/components';
import { useSelect, useDispatch } from '@finpress/data';
import { store as noticesStore } from '@finpress/notices';

// Last three notices. Slices from the tail end of the list.
const MAX_VISIBLE_NOTICES = -3;

/**
 * Renders the editor snackbars component.
 *
 * @return {React.ReactNode} The rendered component.
 */
export default function EditorSnackbars() {
	const notices = useSelect(
		( select ) => select( noticesStore ).getNotices(),
		[]
	);
	const { removeNotice } = useDispatch( noticesStore );
	const snackbarNotices = notices
		.filter( ( { type } ) => type === 'snackbar' )
		.slice( MAX_VISIBLE_NOTICES );

	return (
		<SnackbarList
			notices={ snackbarNotices }
			className="components-editor-notices__snackbar"
			onRemove={ removeNotice }
		/>
	);
}
