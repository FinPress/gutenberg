/**
 * WordPress dependencies
 */
import { BlockIcon, RichText, useBlockProps } from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { Placeholder } from '@wordpress/components';
import { formatListNumbered as icon } from '@wordpress/icons';
import { useEffect, useMemo } from '@wordpress/element';

export default function FootnotesEdit( {
	attributes,
	setAttributes,
	context: { postType, postId },
} ) {
	const [ meta, updateMeta ] = useEntityProp(
		'postType',
		postType,
		'meta',
		postId
	);
	const footnotesSupported = 'string' === typeof meta?.footnotes;
	const metaFootnotes = useMemo(
		() => ( meta?.footnotes ? JSON.parse( meta.footnotes ) : [] ),
		[ meta ]
	);
	const { footnotes = metaFootnotes } = attributes;
	const blockProps = useBlockProps();

	useEffect( () => {
		// If the footnotes attribute is not set, initialize it with the meta value.
		if ( ! attributes.footnotes.length && metaFootnotes.length ) {
			setAttributes( { footnotes: metaFootnotes } );
		}
	}, [ attributes.footnotes.length, metaFootnotes, setAttributes ] );

	if ( ! footnotesSupported ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					icon={ <BlockIcon icon={ icon } /> }
					label={ __( 'Footnotes' ) }
					instructions={ __(
						'Footnotes are not supported here. Add this block to post or page content.'
					) }
				/>
			</div>
		);
	}

	if ( ! footnotes.length ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					icon={ <BlockIcon icon={ icon } /> }
					label={ __( 'Footnotes' ) }
					instructions={ __(
						'Footnotes found in blocks within this document will be displayed here.'
					) }
				/>
			</div>
		);
	}

	return (
		<ol { ...blockProps }>
			{ footnotes.map( ( { id, content } ) => (
				/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
				<li
					key={ id }
					onMouseDown={ ( event ) => {
						// When clicking on the list item (not on descendants),
						// focus the rich text element since it's only 1px wide when
						// empty.
						if ( event.target === event.currentTarget ) {
							event.target.firstElementChild.focus();
							event.preventDefault();
						}
					} }
				>
					<RichText
						id={ id }
						tagName="span"
						value={ content }
						identifier={ id }
						// To do: figure out why the browser is not scrolling
						// into view when it receives focus.
						onFocus={ ( event ) => {
							if ( ! event.target.textContent.trim() ) {
								event.target.scrollIntoView();
							}
						} }
						onChange={ ( nextFootnote ) => {
							updateMeta( {
								...meta,
								footnotes: JSON.stringify(
									footnotes.map( ( footnote ) => {
										return footnote.id === id
											? {
													content: nextFootnote,
													id,
											  }
											: footnote;
									} )
								),
							} );
						} }
					/>{ ' ' }
					<a href={ `#${ id }-link` }>↩︎</a>
				</li>
			) ) }
		</ol>
	);
}
