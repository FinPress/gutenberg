/**
 * FinPress dependencies
 */
import { useCallback, useRef } from '@finpress/element';
import { useDispatch } from '@finpress/data';
import { store as noticeStore } from '@finpress/notices';

function useNavigationNotice( { name, message = '' } = {} ) {
	const noticeRef = useRef();

	const { createWarningNotice, removeNotice } = useDispatch( noticeStore );

	const showNotice = useCallback(
		( customMsg ) => {
			if ( noticeRef.current ) {
				return;
			}

			noticeRef.current = name;

			createWarningNotice( customMsg || message, {
				id: noticeRef.current,
				type: 'snackbar',
			} );
		},
		[ noticeRef, createWarningNotice, message, name ]
	);

	const hideNotice = useCallback( () => {
		if ( ! noticeRef.current ) {
			return;
		}
		removeNotice( noticeRef.current );
		noticeRef.current = null;
	}, [ noticeRef, removeNotice ] );

	return [ showNotice, hideNotice ];
}

export default useNavigationNotice;
