/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { privateApis as routerPrivateApis } from '@wordpress/router';

/**
 * Internal dependencies
 */
import { store as editSiteStore } from '../../store';
import { unlock } from '../../lock-unlock';
import useNavigateToEntityRecord from './use-navigate-to-entity-record';
import { FOCUSABLE_ENTITIES } from '../../utils/constants';

const { useLocation, useHistory } = unlock( routerPrivateApis );

function useNavigateToPreviousEntityRecord() {
	const location = useLocation();
	const history = useHistory();
	return useMemo( () => {
		const isFocusMode =
			location.query.focusMode ||
			( location?.params?.postId &&
				FOCUSABLE_ENTITIES.includes( location?.params?.postType ) );
		const { priorCanvas } = location.state || {};
		const showBackButton = isFocusMode && priorCanvas === 'edit';
		return showBackButton ? () => history.back() : undefined;
	}, [ location, history ] );
}

export function useSpecificEditorSettings() {
	const { query } = useLocation();
	const { canvas = 'view' } = query;
	const onNavigateToEntityRecord = useNavigateToEntityRecord();
	const { settings } = useSelect( ( select ) => {
		const { getSettings } = select( editSiteStore );
		return {
			settings: getSettings(),
		};
	}, [] );

	const onNavigateToPreviousEntityRecord =
		useNavigateToPreviousEntityRecord();
	const defaultEditorSettings = useMemo( () => {
		return {
			...settings,

			richEditingEnabled: true,
			supportsTemplateMode: true,
			focusMode: canvas !== 'view',
			onNavigateToEntityRecord,
			onNavigateToPreviousEntityRecord,
			isPreviewMode: canvas === 'view',
		};
	}, [
		settings,
		canvas,
		onNavigateToEntityRecord,
		onNavigateToPreviousEntityRecord,
	] );

	return defaultEditorSettings;
}
