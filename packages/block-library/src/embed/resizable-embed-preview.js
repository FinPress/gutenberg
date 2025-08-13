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
import { useState, useRef } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { getAuthority } from '@wordpress/url';
import { useResizeObserver } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { getPhotoHtml } from './util';
import WpEmbedPreview from './wp-embed-preview';

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

	// Use resize observer like image block - attach to embed container
	const setResizeObserved = useResizeObserver( ( [ entry ] ) => {
		if ( ! resizeDelta ) {
			const [ box ] = entry.borderBoxSize || [ entry.contentRect ];
			setPixelSize( {
				width: box.inlineSize || box.width,
				height: box.blockSize || box.height,
			} );
		}
	} );

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
					setResizeObserved( node );
				} }
			>
				<SandBox
					html={ html }
					scripts={ scripts }
					title={ iframeTitle }
					type={ sandboxClassnames }
					onFocus={ hideOverlay }
				/>
				{ ! interactive && ! isSelected && (
					<div
						className="block-library-embed__interactive-overlay"
						onMouseUp={ hideOverlay }
						style={ {
							pointerEvents: isSelected ? 'none' : 'auto',
						} }
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

	// Calculate current size with delta for real-time feedback
	const currentSize = resizeDelta
		? {
				width: pixelSize.width + resizeDelta.width,
				height: pixelSize.height + resizeDelta.height,
		  }
		: pixelSize;

	// Apply width styling for real-time feedback during resize
	const embedContentWithResize = (
		<div
			style={ {
				width: currentSize.width
					? `${ currentSize.width }px`
					: undefined,
				transition: resizeDelta ? 'none' : 'width 0.1s ease',
			} }
		>
			{ embedContent }
		</div>
	);

	// Show resizable box only when selected and previewable
	let resizableBox;
	if ( isSelected && previewable ) {
		// Calculate current dimensions
		const numericWidth = attributes.width
			? parseInt( attributes.width, 10 )
			: null;
		const customRatio = pixelSize.width / pixelSize.height;
		const naturalRatio =
			preview.width && preview.height
				? preview.width / preview.height
				: aspectRatio;
		const ratio = numericWidth
			? customRatio || naturalRatio || aspectRatio
			: naturalRatio || aspectRatio;

		resizableBox = (
			<ResizableBox
				style={ {
					position: 'absolute',
					inset: '0 0 0 0',
				} }
				size={ pixelSize }
				minWidth={ 50 }
				lockAspectRatio={ ratio }
				enable={ {
					top: false,
					right: true,
					bottom: false,
					left: false,
				} }
				onResizeStart={ () => {
					toggleSelection( false );
				} }
				onResize={ ( event, direction, elt, delta ) => {
					setResizeDelta( delta );
					// Don't update pixelSize here - let ResizableBox handle it
				} }
				onResizeStop={ ( event, direction, elt, delta ) => {
					toggleSelection( true );
					setResizeDelta( null );

					// Update pixelSize only after resize is complete
					const newPixelSize = {
						width: pixelSize.width + delta.width,
						height: pixelSize.height + delta.height,
					};
					setPixelSize( newPixelSize );

					// Set the final width
					setAttributes( {
						width: `${ newPixelSize.width }px`,
						height: undefined, // Let CSS maintain aspect ratio
					} );
				} }
				showHandle
			/>
		);
	}

	return (
		<div style={ { position: 'relative' } }>
			{ embedContentWithResize }
			{ resizableBox }
		</div>
	);
}
