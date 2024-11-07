/**
 * WordPress dependencies
 */
import { BlockIcon, MediaPlaceholder } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { cover as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { ALLOWED_MEDIA_TYPES } from '../shared';

export default function CoverPlaceholder( {
	disableMediaButtons = false,
	children,
	onSelectMedia,
	onError,
	style,
	toggleUseFeaturedImage,
} ) {
	return (
		<MediaPlaceholder
			icon={ <BlockIcon icon={ icon } /> }
			labels={ {
				title: __( 'Cover' ),
				instructions: __(
					'Drag and drop an image or video here, upload, or choose from your library.'
				),
			} }
			onSelect={ onSelectMedia }
			accept="image/*,video/*"
			allowedTypes={ ALLOWED_MEDIA_TYPES }
			disableMediaButtons={ disableMediaButtons }
			onToggleFeaturedImage={ toggleUseFeaturedImage }
			onError={ onError }
			style={ style }
		>
			{ children }
		</MediaPlaceholder>
	);
}
