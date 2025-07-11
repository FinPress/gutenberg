/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function save( {
	attributes: { textAlign, isLink, rel, linkTarget, href },
} ) {
	const TagName = 'span';
	const blockProps = useBlockProps.save( {
		className: textAlign ? `has-text-align-${ textAlign }` : undefined,
	} );

	return (
		<TagName { ...blockProps }>
			{ isLink ? (
				<a href={ href } target={ linkTarget } rel={ rel }>
					{ __( 'Term Name' ) }
				</a>
			) : (
				__( 'Term Name' )
			) }
		</TagName>
	);
}
