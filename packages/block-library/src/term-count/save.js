/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function save( { attributes: { textAlign, format } } ) {
	const blockProps = useBlockProps.save( {
		className: textAlign ? `has-text-align-${ textAlign }` : undefined,
	} );

	return (
		<span { ...blockProps }>
			{ /* This will be replaced by the server-side render */ }
			{ __( 'Term Count' ) }
		</span>
	);
}
