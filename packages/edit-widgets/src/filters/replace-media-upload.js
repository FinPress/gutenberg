/**
 * FinPress dependencies
 */
import { addFilter } from '@finpress/hooks';
import { MediaUpload } from '@finpress/media-utils';

const replaceMediaUpload = () => MediaUpload;

addFilter(
	'editor.MediaUpload',
	'core/edit-widgets/replace-media-upload',
	replaceMediaUpload
);
