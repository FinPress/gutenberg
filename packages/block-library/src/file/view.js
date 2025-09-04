/**
 * FinPress dependencies
 */
import { store } from '@finpress/interactivity';
/**
 * Internal dependencies
 */
import { browserSupportsPdfs } from './utils';

store(
	'core/file',
	{
		state: {
			get hasPdfPreview() {
				return browserSupportsPdfs();
			},
		},
	},
	{ lock: true }
);
