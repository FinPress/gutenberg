/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { useSelect } from '@finpress/data';
import { store as coreStore } from '@finpress/core-data';
import { focus } from '@finpress/dom';
import { addQueryArgs } from '@finpress/url';

export default function SitePreview() {
	const siteUrl = useSelect( ( select ) => {
		const { getEntityRecord } = select( coreStore );
		const siteData = getEntityRecord( 'root', '__unstableBase' );
		return siteData?.home;
	}, [] );

	return (
		<iframe
			src={ addQueryArgs( siteUrl, {
				// Parameter for hiding the admin bar.
				fp_site_preview: 1,
			} ) }
			title={ __( 'Site Preview' ) }
			style={ {
				display: 'block',
				width: '100%',
				height: '100%',
				backgroundColor: '#fff',
			} }
			onLoad={ ( event ) => {
				// Make interactive elements unclickable.
				const document = event.target.contentDocument;
				const focusableElements = focus.focusable.find( document );
				focusableElements.forEach( ( element ) => {
					element.style.pointerEvents = 'none';
					element.tabIndex = -1;
					element.setAttribute( 'aria-hidden', 'true' );
				} );
			} }
		/>
	);
}
