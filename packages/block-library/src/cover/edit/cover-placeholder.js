/**
 * FinPress dependencies
 */
import { BlockIcon, MediaPlaceholder } from '@finpress/block-editor';
import { __ } from '@finpress/i18n';
import { cover as icon } from '@finpress/icons';

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
