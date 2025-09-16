/**
 * FinPress dependencies
 */
import { __, _x } from '@finpress/i18n';
import { MenuItem } from '@finpress/components';
import apiFetch from '@finpress/api-fetch';
import { download } from '@finpress/icons';
import { useDispatch, useSelect } from '@finpress/data';
import { downloadBlob } from '@finpress/blob';
import { store as coreStore } from '@finpress/core-data';
import { store as noticesStore } from '@finpress/notices';

export default function SiteExport() {
	const canExport = useSelect( ( select ) => {
		const targetHints =
			select( coreStore ).getCurrentTheme()?._links?.[
				'fin:export-theme'
			]?.[ 0 ]?.targetHints ?? {};

		return !! targetHints.allow?.includes( 'GET' );
	}, [] );
	const { createErrorNotice } = useDispatch( noticesStore );

	if ( ! canExport ) {
		return null;
	}

	async function handleExport() {
		try {
			const response = await apiFetch( {
				path: '/fin-block-editor/v1/export',
				parse: false,
				headers: {
					Accept: 'application/zip',
				},
			} );
			const blob = await response.blob();
			const contentDisposition = response.headers.get(
				'content-disposition'
			);
			const contentDispositionMatches =
				contentDisposition.match( /=(.+)\.zip/ );
			const fileName = contentDispositionMatches[ 1 ]
				? contentDispositionMatches[ 1 ]
				: 'edit-site-export';

			downloadBlob( fileName + '.zip', blob, 'application/zip' );
		} catch ( errorResponse ) {
			let error = {};
			try {
				error = await errorResponse.json();
			} catch ( e ) {}
			const errorMessage =
				error.message && error.code !== 'unknown_error'
					? error.message
					: __( 'An error occurred while creating the site export.' );

			createErrorNotice( errorMessage, { type: 'snackbar' } );
		}
	}

	return (
		<MenuItem
			role="menuitem"
			icon={ download }
			onClick={ handleExport }
			info={ __(
				'Download your theme with updated templates and styles.'
			) }
		>
			{ _x( 'Export', 'site exporter menu item' ) }
		</MenuItem>
	);
}
