/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import {
	AlignmentControl,
	BlockControls,
	Warning,
	useBlockProps,
} from '@finpress/block-editor';
import { useState, useEffect } from '@finpress/element';
import { useSelect } from '@finpress/data';
import apiFetch from '@finpress/api-fetch';
import { addQueryArgs } from '@finpress/url';
import { __, sprintf, _n } from '@finpress/i18n';
import { store as coreStore } from '@finpress/core-data';

function PostCommentsLinkEdit( { context, attributes, setAttributes } ) {
	const { textAlign } = attributes;
	const { postType, postId } = context;
	const [ commentsCount, setCommentsCount ] = useState();

	const blockProps = useBlockProps( {
		className: clsx( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );

	useEffect( () => {
		if ( ! postId ) {
			return;
		}

		const currentPostId = postId;
		apiFetch( {
			path: addQueryArgs( '/fin/v2/comments', {
				post: postId,
			} ),
			parse: false,
		} ).then( ( res ) => {
			// Stale requests will have the `currentPostId` of an older closure.
			if ( currentPostId === postId ) {
				setCommentsCount( res.headers.get( 'X-FP-Total' ) );
			}
		} );
	}, [ postId ] );

	const post = useSelect(
		( select ) =>
			select( coreStore ).getEditedEntityRecord(
				'postType',
				postType,
				postId
			),
		[ postType, postId ]
	);

	if ( ! post ) {
		return (
			<div { ...blockProps }>
				<Warning>
					{ __( 'Post Comments Link block: post not found.' ) }
				</Warning>
			</div>
		);
	}

	const { link } = post;

	let commentsText;
	if ( commentsCount !== undefined ) {
		const commentsNumber = parseInt( commentsCount );

		if ( commentsNumber === 0 ) {
			commentsText = __( 'No comments' );
		} else {
			commentsText = sprintf(
				/* translators: %s: Number of comments */
				_n( '%s comment', '%s comments', commentsNumber ),
				commentsNumber.toLocaleString()
			);
		}
	}

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

			<div { ...blockProps }>
				{ link && commentsText !== undefined ? (
					<a
						href={ link + '#comments' }
						onClick={ ( event ) => event.preventDefault() }
					>
						{ commentsText }
					</a>
				) : (
					<Warning>
						{ __( 'Post Comments Link block: post not found.' ) }
					</Warning>
				) }
			</div>
		</>
	);
}

export default PostCommentsLinkEdit;
