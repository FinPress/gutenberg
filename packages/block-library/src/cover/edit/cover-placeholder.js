/**
 * WordPress dependencies
 */
import { BlockIcon, MediaPlaceholder } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { cover as icon } from '@wordpress/icons';
import { Placeholder } from '@wordpress/components';
import { useResizeObserver } from '@wordpress/compose';

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
	isSelected,
} ) {
	const [ placeholderResizeListener, { width: placeholderWidth } ] =
		useResizeObserver();

	const isSmallContainer = placeholderWidth && placeholderWidth < 160;

	return (
		<MediaPlaceholder
			icon={ <BlockIcon icon={ icon } /> }
			onSelect={ onSelectMedia }
			accept="image/*,video/*"
			allowedTypes={ ALLOWED_MEDIA_TYPES }
			disableMediaButtons={ disableMediaButtons }
			onToggleFeaturedImage={ toggleUseFeaturedImage }
			onError={ onError }
			style={ style }
			placeholder={ ( content ) => (
				<Placeholder
					className="block-editor-media-placeholder"
					icon={ icon }
					withIllustration={ ! isSelected || isSmallContainer }
					label={ ! isSmallContainer && __( 'Cover' ) }
					instructions={ __(
						'Drag and drop onto this block, upload, or select existing media from your library.'
					) }
				>
					{ content }
					{ isSelected && children }
					{ placeholderResizeListener }
				</Placeholder>
			) }
		/>
	);
}
