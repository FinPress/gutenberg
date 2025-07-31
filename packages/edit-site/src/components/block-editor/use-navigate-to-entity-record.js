/**
 * WordPress dependencies
 */
import { privateApis as routerPrivateApis } from '@wordpress/router';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { useHistory } = unlock( routerPrivateApis );

export default function useNavigateToEntityRecord() {
	const history = useHistory();

	const onNavigateToEntityRecord = useCallback(
		( params ) => {
			const { focusMode = true, ...navigationParams } = params;
			const queryParams = [ 'canvas=edit' ];

			if ( focusMode ) {
				queryParams.push( 'focusMode=true' );
			}

			history.navigate(
				`/${ navigationParams.postType }/${
					navigationParams.postId
				}?${ queryParams.join( '&' ) }`
			);
		},
		[ history ]
	);

	return onNavigateToEntityRecord;
}
