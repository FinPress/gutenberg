/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function save( { attributes: { textAlign } } ) {
	const blockProps = useBlockProps.save( {
		className: textAlign ? `has-text-align-${ textAlign }` : undefined,
	} );

	return <span { ...blockProps }>{ __( 'Term Count' ) }</span>;
}
