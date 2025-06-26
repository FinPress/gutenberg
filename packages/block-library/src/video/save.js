/**
 * WordPress dependencies
 */
import {
	RichText,
	useBlockProps,
	__experimentalGetElementClassName,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Tracks from './tracks';

export default function save( { attributes } ) {
	const {
		autoplay,
		caption,
		controls,
		loop,
		muted,
		poster,
		preload,
		src,
		playsInline,
		tracks,
	} = attributes;

	const hasSrc = !! src;
	const hasCaption = ! RichText.isEmpty( caption );

	if ( ! hasSrc && ! hasCaption ) {
		return null;
	}

	return (
		<figure { ...useBlockProps.save() }>
			{ hasSrc && (
				<video
					autoPlay={ autoplay }
					controls={ controls }
					loop={ loop }
					muted={ muted }
					poster={ poster }
					preload={ preload !== 'metadata' ? preload : undefined }
					src={ src }
					playsInline={ playsInline }
				>
					<Tracks tracks={ tracks } />
				</video>
			) }
			{ hasCaption && (
				<RichText.Content
					className={ __experimentalGetElementClassName( 'caption' ) }
					tagName="figcaption"
					value={ caption }
				/>
			) }
		</figure>
	);
}
