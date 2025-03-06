/**
 * WordPress dependencies
 */
import { privateApis as routerPrivateApis } from '@wordpress/router';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { useHistory, useLocation } = unlock( routerPrivateApis );

export default function useNavigateToEntityRecord() {
	const history = useHistory();
	const { query } = useLocation();

	const onNavigateToEntityRecord = useCallback(
		( params ) => {
			history.navigate(
				`/${ params.postType }/${ params.postId }?canvas=edit&focusMode=true`,
				{ state: { priorCanvas: query.canvas } }
			);
		},
		[ history, query.canvas ]
	);

	return onNavigateToEntityRecord;
}
