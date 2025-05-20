/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, PlainText } from '@wordpress/block-editor';

const arrowMap = {
	none: '',
	arrow: '←',
	chevron: '«',
};

/*
 * Renders the Comments Pagination Previous block in the block editor.
 *
 * @param {Object} props                                   Component properties.
 * @param {Object} props.attributes                        Block attributes.
 * @param {string} props.attributes.label                  The label for the "Previous Comments" pagination link.
 * @param {Function} props.setAttributes                   Function to update block attributes.
 * @param {Object} props.context                           Block context.
 * @param {string} props.context['comments/paginationArrow'] The type of arrow to display for pagination (e.g., "next", "previous").
 * @returns {JSX.Element}                                  The Comments Pagination Previous Edit component.
 */
export default function CommentsPaginationPreviousEdit( {
	attributes: { label },
	setAttributes,
	context: { 'comments/paginationArrow': paginationArrow },
} ) {
	const displayArrow = arrowMap[ paginationArrow ];
	return (
		<a
			href="#comments-pagination-previous-pseudo-link"
			onClick={ ( event ) => event.preventDefault() }
			{ ...useBlockProps() }
		>
			{ displayArrow && (
				<span
					className={ `wp-block-comments-pagination-previous-arrow is-arrow-${ paginationArrow }` }
				>
					{ displayArrow }
				</span>
			) }
			<PlainText
				__experimentalVersion={ 2 }
				tagName="span"
				aria-label={ __( 'Older comments page link' ) }
				placeholder={ __( 'Older Comments' ) }
				value={ label }
				onChange={ ( newLabel ) =>
					setAttributes( { label: newLabel } )
				}
			/>
		</a>
	);
}
