/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect, useRef } from '@wordpress/element';

function PostAuthorNameEdit( {
	isSelected,
	context: { postType, postId },
	attributes: { textAlign, isLink, linkTarget },
	setAttributes,
} ) {
	const { createNotice } = useDispatch( noticesStore );
	const noticeDisplayedRef = useRef( false );
	const { authorName, supportsAuthor } = useSelect(
		( select ) => {
			const { getEditedEntityRecord, getUser } = select( coreStore );
			const _authorId = getEditedEntityRecord(
				'postType',
				postType,
				postId
			)?.author;

			return {
				authorName: _authorId ? getUser( _authorId ) : null,
				supportsAuthor:
					select( coreStore ).getPostType( postType )?.supports
						?.author ?? false,
			};
		},
		[ postType, postId ]
	);

	useEffect( () => {
		// The extra `! noticeDisplayedRef.current` check avoids duplicate notices in development mode (React.StrictMode).
		if ( ! supportsAuthor && ! noticeDisplayedRef.current && isSelected ) {
			createNotice(
				'warning',
				__(
					'The current post type does not support authors. The Post Author Name block will not be displayed.'
				),
				{
					isDismissible: true,
				}
			);
			noticeDisplayedRef.current = true;
		}
	}, [ supportsAuthor, createNotice, isSelected ] );

	const blockProps = useBlockProps( {
		className: clsx( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );

	const displayName = authorName?.name || __( 'Author Name' );

	const displayAuthor = isLink ? (
		<a
			href="#author-pseudo-link"
			onClick={ ( event ) => event.preventDefault() }
			className="wp-block-post-author-name__link"
		>
			{ displayName }
		</a>
	) : (
		displayName
	);

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Link to author archive' ) }
						onChange={ () => setAttributes( { isLink: ! isLink } ) }
						checked={ isLink }
					/>
					{ isLink && (
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Open in new tab' ) }
							onChange={ ( value ) =>
								setAttributes( {
									linkTarget: value ? '_blank' : '_self',
								} )
							}
							checked={ linkTarget === '_blank' }
						/>
					) }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }> { displayAuthor } </div>
		</>
	);
}

export default PostAuthorNameEdit;
