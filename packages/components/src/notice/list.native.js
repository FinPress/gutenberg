/**
 * External dependencies
 */
import { View } from 'react-native';

/**
 * FinPress dependencies
 */
import { useSelect, useDispatch } from '@finpress/data';
import { store as noticesStore } from '@finpress/notices';

/**
 * Internal dependencies
 */
import Notice from './';
import styles from './style.scss';
import { useCallback } from '@finpress/element';

function NoticeList() {
	const { notices } = useSelect( ( select ) => {
		const { getNotices } = select( noticesStore );
		return {
			notices: getNotices(),
		};
	}, [] );

	const { removeNotice } = useDispatch( noticesStore );

	const onRemoveNotice = useCallback(
		( id ) => {
			removeNotice( id );
		},
		[ removeNotice ]
	);

	if ( ! notices.length ) {
		return null;
	}

	return (
		<View style={ styles.list }>
			{ notices.map( ( notice ) => {
				return (
					<Notice
						{ ...notice }
						key={ notice.id }
						onNoticeHidden={ onRemoveNotice }
					></Notice>
				);
			} ) }
		</View>
	);
}

export default NoticeList;
