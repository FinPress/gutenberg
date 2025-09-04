/**
 * FinPress dependencies
 */
import { __experimentalText as Text } from '@finpress/components';
import { useSelect } from '@finpress/data';
import { __, sprintf } from '@finpress/i18n';
import { humanTimeDiff } from '@finpress/date';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';

export default function PostLastEditedPanel() {
	const modified = useSelect(
		( select ) =>
			select( editorStore ).getEditedPostAttribute( 'modified' ),
		[]
	);
	const lastEditedText =
		modified &&
		sprintf(
			// translators: %s: Human-readable time difference, e.g. "2 days ago".
			__( 'Last edited %s.' ),
			humanTimeDiff( modified )
		);
	if ( ! lastEditedText ) {
		return null;
	}
	return (
		<div className="editor-post-last-edited-panel">
			<Text>{ lastEditedText }</Text>
		</div>
	);
}
