/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import {
	useBlockProps,
	BlockControls,
	AlignmentControl,
} from '@finpress/block-editor';

export default function TermDescriptionEdit( {
	attributes,
	setAttributes,
	mergedStyle,
} ) {
	const { textAlign } = attributes;
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
				<div className="wp-block-term-description__placeholder">
					<span>{ __( 'Term Description' ) }</span>
				</div>
			</div>
		</>
	);
}
