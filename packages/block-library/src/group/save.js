/**
 * WordPress dependencies
 */
import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes: { tagName: Tag }, attributes } ) {
	const { textAlign } = attributes;

	return (
		<Tag
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					className: textAlign ? `has-text-align-${ textAlign }` : '',
					style: { textAlign },
				} )
			) }
		/>
	);
}
