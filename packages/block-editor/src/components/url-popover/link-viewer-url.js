/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { ExternalLink } from '@finpress/components';
import { safeDecodeURI, filterURLForDisplay } from '@finpress/url';

export default function LinkViewerURL( { url, urlLabel, className } ) {
	const linkClassName = clsx(
		className,
		'block-editor-url-popover__link-viewer-url'
	);

	if ( ! url ) {
		return <span className={ linkClassName }></span>;
	}

	return (
		<ExternalLink className={ linkClassName } href={ url }>
			{ urlLabel || filterURLForDisplay( safeDecodeURI( url ) ) }
		</ExternalLink>
	);
}
