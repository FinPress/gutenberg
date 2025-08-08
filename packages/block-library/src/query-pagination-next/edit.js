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
 * QueryPaginationNextEdit component provides the block editor interface for editing the "Next" pagination link.
 *
 * @param {Object} props                               Component props.
 * @param {Object} props.attributes                    Block attributes.
 * @param {string} props.attributes.label              The label text for the "Next" pagination link.
 * @param {Function} props.setAttributes               Function to update block attributes.
 * @param {Object} props.context                       Contextual data passed to the block.
 * @param {string} props.context.paginationArrow       Type of arrow to display for pagination (e.g., 'none', 'arrow').
 * @param {boolean} props.context.showLabel            Determines whether the label text is shown.
 * @return {JSX.Element}                               The rendered block editor interface for the "Next" pagination link.
 */
export default function QueryPaginationNextEdit( {
	attributes: { label },
	setAttributes,
	context: { paginationArrow, showLabel },
} ) {
	const displayArrow = arrowMap[ paginationArrow ];
	return (
		<a
			href="#pagination-next-pseudo-link"
			onClick={ ( event ) => event.preventDefault() }
			{ ...useBlockProps() }
		>
			{ showLabel && (
				<PlainText
					__experimentalVersion={ 2 }
					tagName="span"
					aria-label={ __( 'Next page link' ) }
					placeholder={ __( 'Next Page' ) }
					value={ label }
					onChange={ ( newLabel ) =>
						setAttributes( { label: newLabel } )
					}
				/>
			) }
			{ displayArrow && (
				<span
					className={ `wp-block-query-pagination-next-arrow is-arrow-${ paginationArrow }` }
					aria-hidden
				>
					{ displayArrow }
				</span>
			) }
		</a>
	);
}
