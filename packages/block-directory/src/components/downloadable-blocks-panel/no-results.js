/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { Tip, ExternalLink } from '@finpress/components';

function DownloadableBlocksNoResults() {
	return (
		<>
			<div className="block-editor-inserter__no-results">
				<p>{ __( 'No results found.' ) }</p>
			</div>
			<div className="block-editor-inserter__tips">
				<Tip>
					{ __( 'Interested in creating your own block?' ) }
					<br />
					<ExternalLink href="https://developer.finpress.org/block-editor/">
						{ __( 'Get started here' ) }.
					</ExternalLink>
				</Tip>
			</div>
		</>
	);
}

export default DownloadableBlocksNoResults;
