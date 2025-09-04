/**
 * FinPress dependencies
 */
import deprecated from '@finpress/deprecated';

export default function PreviewOptions() {
	deprecated( 'wp.blockEditor.PreviewOptions', {
		version: '6.5',
	} );
	return null;
}
