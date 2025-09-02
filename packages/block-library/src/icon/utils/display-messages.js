/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';

/**
 * Display a snackbar message if there is an error when inserting an icon
 * from the Media Library.
 *
 * @param {string} messageType The type of message to display.
 */
export function displayMessages( messageType ) {
	const messages = {
		fileTypeUploadError: __(
			'An error occurred while uploading. The file does not appear to be an SVG.'
		),
		fileTypeSelectError: __(
			'An error occurred while inserting the icon. The media selected is not an SVG.'
		),
		fileTypeError: __(
			'An error occurred while inserting the icon. Check that the file is valid SVG.'
		),
	};

	// Disabling as to not make core/notices a dependency of this package.
	// eslint-disable-next-line @wordpress/data-no-store-string-literals
	dispatch( 'core/notices' ).createNotice(
		'snackbar-notice',
		messageType ? messages[ messageType ] : messages.fileType,
		{ type: 'snackbar', isDismissible: true }
	);
}
