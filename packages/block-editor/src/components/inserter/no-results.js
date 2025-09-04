/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';

function InserterNoResults() {
	return (
		<div className="block-editor-inserter__no-results">
			<p>{ __( 'No results found.' ) }</p>
		</div>
	);
}

export default InserterNoResults;
