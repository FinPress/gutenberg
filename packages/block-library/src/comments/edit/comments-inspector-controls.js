/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	HTMLElementSelectControl,
} from '@wordpress/block-editor';

export default function CommentsInspectorControls( {
	attributes: { tagName },
	setAttributes,
	clientId,
} ) {
	return (
		<InspectorControls>
			<InspectorControls group="advanced">
				<HTMLElementSelectControl
					tagName={ tagName }
					onChange={ ( value ) =>
						setAttributes( { tagName: value } )
					}
					currentClientId={ clientId }
					checkForMainTag={ false }
					options={ [
						{ label: __( 'Default (<div>)' ), value: 'div' },
						{ label: '<section>', value: 'section' },
						{ label: '<aside>', value: 'aside' },
					] }
				/>
			</InspectorControls>
		</InspectorControls>
	);
}
