/**
 * WordPress dependencies
 */
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	Button,
	BaseControl,
	__experimentalHStack as HStack,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';

const COVER_POSTER_ALLOWED_MEDIA_TYPES = [ 'image' ];

function PosterImage( { poster, setAttributes } ) {
	const posterImageButton = useRef();
	const instanceId = useInstanceId( PosterImage );
	const videoPosterDescription = `cover-block__poster-image-description-${ instanceId }`;

	function onSelectPoster( image ) {
		setAttributes( { poster: image.url } );
	}

	function onRemovePoster() {
		setAttributes( { poster: undefined } );

		// Move focus back to the Media Upload button.
		posterImageButton.current.focus();
	}

	return (
		<ToolsPanelItem
			label={ __( 'Poster image' ) }
			isShownByDefault
			hasValue={ () => !! poster }
			onDeselect={ () => {
				setAttributes( { poster: undefined } );
			} }
		>
			<MediaUploadCheck>
				<BaseControl.VisualLabel>
					{ __( 'Poster image' ) }
				</BaseControl.VisualLabel>
				<HStack justify="flex-start">
					<MediaUpload
						title={ __( 'Select poster image' ) }
						onSelect={ onSelectPoster }
						allowedTypes={ COVER_POSTER_ALLOWED_MEDIA_TYPES }
						render={ ( { open } ) => (
							<Button
								__next40pxDefaultSize
								variant="primary"
								onClick={ open }
								ref={ posterImageButton }
								aria-describedby={ videoPosterDescription }
							>
								{ ! poster ? __( 'Select' ) : __( 'Replace' ) }
							</Button>
						) }
					/>
					<p id={ videoPosterDescription } hidden>
						{ poster
							? sprintf(
									/* translators: %s: poster image URL. */
									__( 'The current poster image url is %s' ),
									poster
							  )
							: __(
									'There is no poster image currently selected'
							  ) }
					</p>
					{ !! poster && (
						<Button
							__next40pxDefaultSize
							onClick={ onRemovePoster }
							variant="tertiary"
						>
							{ __( 'Remove' ) }
						</Button>
					) }
				</HStack>
			</MediaUploadCheck>
		</ToolsPanelItem>
	);
}

export default PosterImage;
