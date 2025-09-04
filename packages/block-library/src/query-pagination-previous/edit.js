/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { useBlockProps, PlainText } from '@finpress/block-editor';

const arrowMap = {
	none: '',
	arrow: '←',
	chevron: '«',
};

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
