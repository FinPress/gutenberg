/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import { speak } from '@wordpress/a11y';

/**
 * Check if a link is previewable.
 *
 * @param {Element} element - The link element.
 * @return {boolean} True if the link is previewable, false otherwise.
 */
function isLinkPreviewable( element ) {
	if ( 'javascript:' === element.protocol ) {
		return true;
	}

	// Only web URLs can be previewed.
	if ( 'https:' !== element.protocol && 'http:' !== element.protocol ) {
		return false;
	}

	const elementHost = element.host.replace( /:(80|443)$/, '' );
	const currentHost = window.location.host.replace( /:(80|443)$/, '' );

	// Only allow links from the same host
	if ( elementHost !== currentHost ) {
		return false;
	}

	// Skip wp login/signup pages, admin ajax, and admin/includes/content directories.
	if (
		/\/wp-(login|signup)\.php$/.test( element.pathname ) ||
		/\/wp-admin\/admin-ajax\.php$/.test( element.pathname ) ||
		/\/wp-(admin|includes|content)(\/|$)/.test( element.pathname )
	) {
		return false;
	}

	return true;
}

/**
 * Handle interactions in the preview iframe.
 *
 * @param {Document} document - The document object of the preview iframe.
 */
function handleInteractions( document ) {
	// Handle link clicks in preview.
	function handleLinkClick( event ) {
		const link = event.target.closest( 'a' );
		if ( ! link ) {
			return;
		}

		const href = link.getAttribute( 'href' );
		if ( ! href ) {
			return;
		}

		// Allow internal jump links and JS links to behave normally without preventing default.
		const isInternalJumpLink = href.startsWith( '#' );
		if ( isInternalJumpLink || ! /^https?:$/.test( link.protocol ) ) {
			return;
		}

		// If the link is not previewable, prevent the browser from navigating to it.
		if ( ! isLinkPreviewable( link ) ) {
			speak( __( 'This link is not live-previewable.' ) );
			event.preventDefault();
			return;
		}

		// This parameter is used to hide the admin bar in the preview iframe.
		const previewUrl = addQueryArgs( href, {
			wp_site_preview: 1,
		} );
		document.location.href = previewUrl;
		event.preventDefault();
	}

	// Handle form submit.
	function handleFormSubmit( event ) {
		const form = event.target.closest( 'form' );
		if ( ! form ) {
			return;
		}

		const action = form.getAttribute( 'action' );
		if ( ! action ) {
			return;
		}

		const method = form.getAttribute( 'method' );

		const urlParser = document.createElement( 'a' );
		urlParser.href = action;

		// If the link is not previewable, prevent the browser from navigating to it.
		if (
			'GET' !== method.toUpperCase() ||
			! isLinkPreviewable( urlParser )
		) {
			speak( __( 'This form is not live-previewable.' ) );
			event.preventDefault();
			return;
		}

		const previewUrl = addQueryArgs( action, {
			wp_site_preview: 1,
		} );
		document.location.href = previewUrl;
		event.preventDefault();
	}

	document.addEventListener( 'click', handleLinkClick, true );
	document.addEventListener( 'submit', handleFormSubmit, true );
}

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
				wp_site_preview: 1,
			} ) }
			title={ __( 'Site Preview' ) }
			style={ {
				display: 'block',
				width: '100%',
				height: '100%',
				backgroundColor: '#fff',
			} }
			// Make interactive elements unclickable.
			onLoad={ ( event ) => {
				handleInteractions( event.target.contentDocument );
			} }
		/>
	);
}
