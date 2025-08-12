/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Placeholder, SandBox, ResizableBox } from '@wordpress/components';
import { BlockIcon, store as blockEditorStore } from '@wordpress/block-editor';
import { useState, useRef, useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { getAuthority } from '@wordpress/url';
import { useResizeObserver } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { getPhotoHtml } from './util';
import WpEmbedPreview from './wp-embed-preview';

const MIN_EMBED_WIDTH = 200;

export default function ResizableEmbedPreview( {
	preview,
	previewable,
	url,
	type,
	isSelected,
	className,
	icon,
	label,
	attributes,
	setAttributes,
	maxContentWidth,
} ) {
	const [ interactive, setInteractive ] = useState( false );
	const [ resizeDelta, setResizeDelta ] = useState( null );
	const [ pixelSize, setPixelSize ] = useState( {} );
	const containerRef = useRef();

	const { toggleSelection } = useDispatch( blockEditorStore );

	// Extract aspect ratio from preview dimensions if available
	const aspectRatio =
		preview.width && preview.height
			? preview.width / preview.height
			: 16 / 9; // Default to 16:9 aspect ratio

	const [ observedWidth, setObservedWidth ] = useState();
	const [ observedHeight, setObservedHeight ] = useState();

	const setResizeObserver = useResizeObserver( ( [ entry ] ) => {
		setObservedWidth( entry.contentRect.width );
		setObservedHeight( entry.contentRect.height );
	} );

	useEffect( () => {
		// Set initial size when component mounts
		if ( containerRef.current && ! pixelSize.width ) {
			const rect = containerRef.current.getBoundingClientRect();
			setPixelSize( { width: rect.width, height: rect.height } );
		}
	}, [ pixelSize.width ] );

	useEffect( () => {
		// Update pixel size when observed dimensions change
		if ( observedWidth && observedHeight && ! resizeDelta ) {
			setPixelSize( { width: observedWidth, height: observedHeight } );
		}
	}, [ observedWidth, observedHeight, resizeDelta ] );

	if ( ! isSelected && interactive ) {
		// We only want to change this when the block is not selected, because changing it when
		// the block becomes selected makes the overlap disappear too early. Hiding the overlay
		// happens on mouseup when the overlay is clicked.
		setInteractive( false );
	}

	const hideOverlay = () => {
		// This is called onMouseUp on the overlay. We can't respond to the `isSelected` prop
		// changing, because that happens on mouse down, and the overlay immediately disappears,
		// and the mouse event can end up in the preview content. We can't use onClick on
		// the overlay to hide it either, because then the editor misses the mouseup event, and
		// thinks we're multi-selecting blocks.
		setInteractive( true );
	};

	const { scripts } = preview;

	const html = 'photo' === type ? getPhotoHtml( preview ) : preview.html;
	const embedSourceUrl = getAuthority( url );
	const iframeTitle = sprintf(
		// translators: %s: host providing embed content e.g: www.youtube.com
		__( 'Embedded content from %s' ),
		embedSourceUrl
	);
	const sandboxClassnames = clsx(
		type,
		className,
		'wp-block-embed__wrapper'
	);

	// Disabled because the overlay div doesn't actually have a role or functionality
	// as far as the user is concerned. We're just catching the first click so that
	// the block can be selected without interacting with the embed preview that the overlay covers.
	/* eslint-disable jsx-a11y/no-static-element-interactions */
	const embedWrapper =
		'wp-embed' === type ? (
			<WpEmbedPreview html={ html } />
		) : (
			<div
				className="wp-block-embed__wrapper"
				ref={ ( node ) => {
					containerRef.current = node;
					setResizeObserver( node );
				} }
			>
				<SandBox
					html={ html }
					scripts={ scripts }
					title={ iframeTitle }
					type={ sandboxClassnames }
					onFocus={ hideOverlay }
				/>
				{ ! interactive && (
					<div
						className="block-library-embed__interactive-overlay"
						onMouseUp={ hideOverlay }
					/>
				) }
			</div>
		);
	/* eslint-enable jsx-a11y/no-static-element-interactions */

	const embedContent = (
		<>
			{ previewable ? (
				embedWrapper
			) : (
				<Placeholder
					icon={ <BlockIcon icon={ icon } showColors /> }
					label={ label }
				>
					<p className="components-placeholder__error">
						<a href={ url }>{ url }</a>
					</p>
					<p className="components-placeholder__error">
						{ sprintf(
							/* translators: %s: host providing embed content e.g: www.youtube.com */
							__(
								"Embedded content from %s can't be previewed in the editor."
							),
							embedSourceUrl
						) }
					</p>
				</Placeholder>
			) }
		</>
	);

	// Show resizable box only when selected and previewable
	if ( isSelected && previewable && pixelSize.width ) {
		const currentWidth = attributes.width
			? parseInt( attributes.width, 10 )
			: pixelSize.width;

		const currentHeight = currentWidth / aspectRatio;

		// Calculate max resize width similar to image block
		// Allow some wiggle room beyond the content width for better UX
		const maxWidthBuffer = pixelSize.width * 2.5;
		const maxResizeWidth = maxContentWidth || maxWidthBuffer;

		return (
			<div
				style={ {
					position: 'relative',
					display: 'inline-block',
					maxWidth: '100%',
				} }
			>
				<ResizableBox
					style={ {
						position: 'relative',
						display: 'block',
						overflow: 'visible',
					} }
					size={ {
						width: resizeDelta
							? Math.max(
									MIN_EMBED_WIDTH,
									Math.min(
										maxResizeWidth,
										currentWidth + resizeDelta.width
									)
							  )
							: currentWidth,
						height: resizeDelta
							? Math.max(
									MIN_EMBED_WIDTH / aspectRatio,
									Math.min(
										maxResizeWidth / aspectRatio,
										( currentWidth + resizeDelta.width ) /
											aspectRatio
									)
							  )
							: currentHeight,
					} }
					minWidth={ MIN_EMBED_WIDTH }
					maxWidth={ maxResizeWidth }
					minHeight={ MIN_EMBED_WIDTH / aspectRatio }
					maxHeight={ maxResizeWidth / aspectRatio }
					lockAspectRatio={ aspectRatio }
					enable={ {
						top: false,
						right: true,
						bottom: false,
						left: false,
						topRight: false,
						bottomRight: false,
						bottomLeft: false,
						topLeft: false,
					} }
					onResizeStart={ () => {
						toggleSelection( false );
					} }
					onResize={ ( event, direction, elt, delta ) => {
						setResizeDelta( delta );
					} }
					onResizeStop={ ( event, direction, elt, delta ) => {
						toggleSelection( true );
						setResizeDelta( null );

						const newWidth = Math.max(
							MIN_EMBED_WIDTH,
							Math.min(
								maxResizeWidth,
								currentWidth + delta.width
							)
						);

						// Clear hardcoded width if the resized width is close to the max-content width.
						if (
							maxContentWidth &&
							Math.abs( newWidth - maxContentWidth ) < 10
						) {
							setAttributes( {
								width: undefined,
								height: undefined,
							} );
						} else {
							setAttributes( {
								width: `${ newWidth }px`,
								// Remove height to let CSS maintain aspect ratio
								height: undefined,
							} );
						}
					} }
					showHandle
				>
					{ embedContent }
				</ResizableBox>
			</div>
		);
	}

	return embedContent;
}
