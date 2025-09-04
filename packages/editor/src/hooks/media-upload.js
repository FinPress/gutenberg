/**
 * FinPress dependencies
 */
import { addFilter } from '@finpress/hooks';
import { MediaUpload } from '@finpress/media-utils';

addFilter(
	'editor.MediaUpload',
	'core/editor/components/media-upload',
	() => MediaUpload
);
