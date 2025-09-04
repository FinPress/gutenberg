/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import {
	RichText,
	useBlockProps,
	__experimentalGetElementClassName,
} from '@finpress/block-editor';

export default function save( { attributes } ) {
	const {
		href,
		fileId,
		fileName,
		textLinkHref,
		textLinkTarget,
		showDownloadButton,
		downloadButtonText,
		displayPreview,
		previewHeight,
	} = attributes;

	const pdfEmbedLabel = RichText.isEmpty( fileName )
		? 'PDF embed'
		: // To do: use toPlainText, but we need ensure it's RichTextData. See
		  // https://github.com/FinPress/gutenberg/pull/56710.
		  fileName.toString();

	const hasFilename = ! RichText.isEmpty( fileName );

	// Only output an `aria-describedby` when the element it's referring to is
	// actually rendered.
	const describedById = hasFilename ? fileId : undefined;

	return (
		href && (
			<div { ...useBlockProps.save() }>
				{ displayPreview && (
					<>
						<object
							className="wp-block-file__embed"
							data={ href }
							type="application/pdf"
							style={ {
								width: '100%',
								height: `${ previewHeight }px`,
							} }
							aria-label={ pdfEmbedLabel }
						/>
					</>
				) }
				{ hasFilename && (
					<a
						id={ describedById }
						href={ textLinkHref }
						target={ textLinkTarget }
						rel={
							textLinkTarget ? 'noreferrer noopener' : undefined
						}
					>
						<RichText.Content value={ fileName } />
					</a>
				) }
				{ showDownloadButton && (
					<a
						href={ href }
						className={ clsx(
							'wp-block-file__button',
							__experimentalGetElementClassName( 'button' )
						) }
						download
						aria-describedby={ describedById }
					>
						<RichText.Content value={ downloadButtonText } />
					</a>
				) }
			</div>
		)
	);
}
