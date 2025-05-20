/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	privateApis as blockEditorPrivateApis,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { HTMLElementControl } = unlock( blockEditorPrivateApis );

/*
 * Renders the Comments Inspector Controls component.
 *
 * This component allows users to select an HTML element (`tagName`) for rendering
 * the comments placeholder in the WordPress editor.
 *
 * @param {Object} props                             Component properties.
 * @param {Object} props.attributes                  The attributes of the component.
 * @param {string} props.attributes.tagName          The HTML element tag name (e.g., 'div', 'section', 'aside').
 * @param {Function} props.setAttributes             Function to update component attributes.
 * @returns {JSX.Element}                            The Comments Inspector Controls component.
 */
export default function CommentsInspectorControls( {
	attributes: { tagName },
	setAttributes,
	clientId,
} ) {
	return (
		<InspectorControls>
			<InspectorControls group="advanced">
				<HTMLElementControl
					tagName={ tagName }
					onChange={ ( value ) =>
						setAttributes( { tagName: value } )
					}
					clientId={ clientId }
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
