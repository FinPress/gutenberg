/**
 * WordPress dependencies
 */
import { privateApis as routerPrivateApis } from '@wordpress/router';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { useLocation } = unlock( routerPrivateApis );

export default function useEditorIframeProps() {
	const { query } = useLocation();
	const { canvas = 'view' } = query;

	// In view mode, make the canvas iframe not focusable and omit the title attribute.
	// Note: the `readonly` variable name could be improved to clarify it's not
	// about the readonly HTML attribute.
	const viewModeIframeProps = {
		tabIndex: -1,
		readonly: true,
	};

	return {
		className: 'edit-site-visual-editor__editor-canvas',
		...( canvas === 'view' ? viewModeIframeProps : {} ),
	};
}
