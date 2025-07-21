/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { getBlockSupport } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import InspectorControls from '../inspector-controls';
import { useSettings } from '../use-settings';

const DEFAULT_UNITS = [
	{
		value: 'px',
		label: 'px',
		default: 0,
	},
	{
		value: 'em',
		label: 'em',
		default: 0,
	},
	{
		value: 'rem',
		label: 'rem',
		default: 0,
	},
	{
		value: '%',
		label: '%',
		default: 0,
	},
];

/**
 * Text indent control component for the block editor.
 *
 * @param {Object}   props               Component props.
 * @param {string}   props.clientId      The block's client ID.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update block attributes.
 * @param {string}   props.name          Block name.
 * @param {Array}    props.units         Available units for the control.
 * @param {number}   props.min           Minimum value.
 * @param {number}   props.max           Maximum value.
 * @param {number}   props.step          Step increment.
 * @param {string}   props.help          Help text for the control.
 * @param {string}   props.label         Label for the control.
 *
 * @return {Element|null} Text indent control component or null.
 */
export default function TextIndentControl( {
	clientId,
	attributes,
	setAttributes,
	name,
	units = DEFAULT_UNITS,
	min = -200,
	max = 200,
	step = 0.1,
	help = __( 'Set the indentation of the first line of text.' ),
	label = __( 'Text indent' ),
} ) {
	// Check if textIndent is enabled globally in settings
	const [ isTextIndentFeatureEnabled ] = useSettings(
		'typography.textIndent'
	);

	// For now, let's make it always enabled for testing
	// Remove this line once the setting is properly implemented in core
	const textIndentEnabled = true; // Override for testing

	if ( ! textIndentEnabled && ! isTextIndentFeatureEnabled ) {
		return null;
	}

	const { textIndent } = attributes;

	const isTextIndentControlEnabledByDefault = getBlockSupport(
		name,
		'typography.defaultControls.textIndent',
		false
	);

	const hasValue = () => {
		return (
			textIndent !== undefined &&
			textIndent !== '' &&
			textIndent !== '0px'
		);
	};

	const resetValue = () => ( { textIndent: undefined } );

	const handleChange = ( newIndent ) => {
		// Convert empty string or '0px' to undefined to clear the attribute
		const cleanedValue =
			newIndent === '' || newIndent === '0px' ? undefined : newIndent;
		setAttributes( { textIndent: cleanedValue } );
	};

	return (
		<InspectorControls group="typography">
			<ToolsPanelItem
				hasValue={ hasValue }
				label={ label }
				isShownByDefault={ isTextIndentControlEnabledByDefault }
				onDeselect={ () => setAttributes( resetValue() ) }
				resetAllFilter={ resetValue }
				panelId={ clientId }
			>
				<UnitControl
					__nextHasNoMarginBottom
					label={ label }
					labelPosition="top"
					value={ textIndent || '' }
					onChange={ handleChange }
					units={ units }
					help={ help }
					min={ min }
					max={ max }
					step={ step }
					size="__unstable-large"
				/>
			</ToolsPanelItem>
		</InspectorControls>
	);
}
