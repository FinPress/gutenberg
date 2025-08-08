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
 * QueryPaginationPreviousEdit component provides the block editor interface
 * for editing the "Previous Page" pagination link.
 *
 * @param {Object} props                        	Component props.
 * @param {Object} props.attributes             	Block attributes.
 * @param {string} props.attributes.label       	The label displayed for the "Previous Page" link.
 * @param {Function} props.setAttributes        	Function to update block attributes.
 * @param {Object} props.context                	Block context.
 * @param {string} props.context.paginationArrow 	The type of arrow to display (e.g., left arrow).
 * @param {boolean} props.context.showLabel     	Whether to display the label for the pagination link.
 * @return {JSX.Element} 							The rendered block editor interface for the "Previous Page" link.
 */
export default function QueryPaginationPreviousEdit( {
	attributes: { label },
	setAttributes,
	context: { paginationArrow, showLabel },
} ) {
	const displayArrow = arrowMap[ paginationArrow ];
	return (
		<a
			href="#pagination-previous-pseudo-link"
			onClick={ ( event ) => event.preventDefault() }
			{ ...useBlockProps() }
		>
			{ displayArrow && (
				<span
					className={ `wp-block-query-pagination-previous-arrow is-arrow-${ paginationArrow }` }
					aria-hidden
				>
					{ displayArrow }
				</span>
			) }
			{ showLabel && (
				<PlainText
					__experimentalVersion={ 2 }
					tagName="span"
					aria-label={ __( 'Previous page link' ) }
					placeholder={ __( 'Previous Page' ) }
					value={ label }
					onChange={ ( newLabel ) =>
						setAttributes( { label: newLabel } )
					}
				/>
			) }
		</a>
	);
}
