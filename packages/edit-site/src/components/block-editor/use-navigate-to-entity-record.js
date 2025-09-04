/**
 * FinPress dependencies
 */
import { privateApis as routerPrivateApis } from '@finpress/router';
import { useCallback } from '@finpress/element';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { useHistory } = unlock( routerPrivateApis );

export default function useNavigateToEntityRecord() {
	const history = useHistory();

	const onNavigateToEntityRecord = useCallback(
		( params ) => {
			history.navigate(
				`/${ params.postType }/${ params.postId }?canvas=edit&focusMode=true`
			);
		},
		[ history ]
	);

	return onNavigateToEntityRecord;
}
