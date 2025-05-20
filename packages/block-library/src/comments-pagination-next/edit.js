/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, PlainText } from '@wordpress/block-editor';

const arrowMap = {
	none: '',
	arrow: '→',
	chevron: '»',
};

/*
 * Renders the Comments Pagination Next block in the block editor.
 *
 * @param {Object} props                                   Component properties.
 * @param {Object} props.attributes                        Block attributes.
 * @param {string} props.attributes.label                  The label for the "Next Comments" pagination link.
 * @param {Function} props.setAttributes                   Function to update block attributes.
 * @param {Object} props.context                           Block context.
 * @param {string} props.context['comments/paginationArrow'] The type of arrow to display for pagination (e.g., "next", "previous").
 * @returns {JSX.Element}                                  The Comments Pagination Next Edit component.
 */
export default function CommentsPaginationNextEdit( {
	attributes: { label },
	setAttributes,
	context: { 'comments/paginationArrow': paginationArrow },
} ) {
	const displayArrow = arrowMap[ paginationArrow ];
	return (
		<a
			href="#comments-pagination-next-pseudo-link"
			onClick={ ( event ) => event.preventDefault() }
			{ ...useBlockProps() }
		>
			<PlainText
				__experimentalVersion={ 2 }
				tagName="span"
				aria-label={ __( 'Newer comments page link' ) }
				placeholder={ __( 'Newer Comments' ) }
				value={ label }
				onChange={ ( newLabel ) =>
					setAttributes( { label: newLabel } )
				}
			/>
			{ displayArrow && (
				<span
					className={ `wp-block-comments-pagination-next-arrow is-arrow-${ paginationArrow }` }
				>
					{ displayArrow }
				</span>
			) }
		</a>
	);
}
