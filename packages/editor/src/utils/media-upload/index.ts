/**
 * External dependencies
 */
import { v4 as uuid } from 'uuid';

/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';
import { uploadMedia } from '@wordpress/media-utils';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';
import type { Attachment } from '@wordpress/media-utils';

const noop = () => {};

interface MediaUploadArgs {
	additionalData?: Record< string, unknown >;
	allowedTypes?: string[];
	filesList: File[];
	maxUploadFileSize?: number;
	onError?: ( error: Error ) => void;
	onFileChange?: ( files: Partial< Attachment >[] ) => void;
	multiple?: boolean;
}

/**
 * Upload a media file when the file upload button is activated.
 * Wrapper around uploadMedia() that injects the current post ID.
 *
 * @param {Object}   $0                   Parameters object passed to the function.
 * @param {?Object}  $0.additionalData    Additional data to include in the request.
 * @param {string}   $0.allowedTypes      Array with the types of media that can be uploaded, if unset all types are allowed.
 * @param {Array}    $0.filesList         List of files.
 * @param {?number}  $0.maxUploadFileSize Maximum upload size in bytes allowed for the site.
 * @param {Function} $0.onError           Function called when an error happens.
 * @param {Function} $0.onFileChange      Function called each time a file or a temporary representation of the file is available.
 * @param {boolean}  $0.multiple          Whether to allow multiple files to be uploaded.
 */
export default function mediaUpload( {
	additionalData = {},
	allowedTypes,
	filesList,
	maxUploadFileSize,
	onError = noop,
	onFileChange,
	multiple = true,
}: MediaUploadArgs ) {
	const { receiveEntityRecords } = dispatch( coreDataStore );
	const { getCurrentPost, getEditorSettings } = select( editorStore );
	const {
		lockPostAutosaving,
		unlockPostAutosaving,
		lockPostSaving,
		unlockPostSaving,
	} = dispatch( editorStore );

	const settings = getEditorSettings() as {
		allowedMimeTypes?: Record< string, string > | null;
		maxUploadFileSize?: number;
	};

	const wpAllowedMimeTypes = settings.allowedMimeTypes;
	const lockKey = `image-upload-${ uuid() }`;
	let imageIsUploading = false;
	maxUploadFileSize = maxUploadFileSize || settings.maxUploadFileSize;
	const currentPost = getCurrentPost() as { id?: number; wp_id?: number };
	// Templates and template parts' numerical ID is stored in `wp_id`.
	const currentPostId =
		typeof currentPost?.id === 'number'
			? currentPost.id
			: currentPost?.wp_id;
	const setSaveLock = () => {
		lockPostSaving( lockKey );
		lockPostAutosaving( lockKey );
		imageIsUploading = true;
	};

	const postData = currentPostId ? { post: currentPostId } : {};
	const clearSaveLock = () => {
		unlockPostSaving( lockKey );
		unlockPostAutosaving( lockKey );
		imageIsUploading = false;
	};

	const onUpload = ( files: Partial< Attachment >[] ) => {
		if ( ! imageIsUploading ) {
			setSaveLock();
		} else {
			clearSaveLock();
		}
		onFileChange?.( files );

		// Files are initially received by `onFileChange` as a blob.
		// After that the function is called a second time with the file as an entity.
		// For core-data, we only care about receiving/invalidating entities.
		const entityFiles = files.filter( ( _file ) => _file?.id );
		if ( entityFiles?.length ) {
			const invalidateCache = true;
			receiveEntityRecords(
				'postType',
				'attachment',
				entityFiles,
				null,
				invalidateCache,
				null,
				null
			);
		}
	};

	uploadMedia( {
		filesList,
		allowedTypes,
		onFileChange: onUpload,
		onError: ( error ) => {
			clearSaveLock();
			onError( error );
		},
		additionalData: {
			...postData,
			...additionalData,
		},
		maxUploadFileSize,
		wpAllowedMimeTypes,
		multiple,
	} );
}
