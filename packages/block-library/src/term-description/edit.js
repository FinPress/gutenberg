/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	BlockControls,
	AlignmentControl,
} from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';

export default function TermDescriptionEdit( {
	attributes,
	setAttributes,
	mergedStyle,
	context: { taxonomy, termId },
} ) {
	const { textAlign } = attributes;
	const [ termDescription ] = useEntityProp(
		'taxonomy',
		taxonomy,
		'description',
		termId
	);
	const blockProps = useBlockProps( {
		className: clsx( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
		style: mergedStyle,
	} );
	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>
			<div { ...blockProps }>
				{ termDescription ? termDescription : __( 'Term Description' ) }
			</div>
		</>
	);
}
