/**
 * FinPress dependencies
 */
import {
	PanelBody,
	__experimentalUseSlotFills as useSlotFills,
} from '@finpress/components';
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import {
	default as InspectorControls,
	InspectorAdvancedControls,
} from '../inspector-controls';

const AdvancedControls = () => {
	const fills = useSlotFills( InspectorAdvancedControls.slotName );
	const hasFills = Boolean( fills && fills.length );

	if ( ! hasFills ) {
		return null;
	}

	return (
		<PanelBody
			className="block-editor-block-inspector__advanced"
			title={ __( 'Advanced' ) }
			initialOpen={ false }
		>
			<InspectorControls.Slot group="advanced" />
		</PanelBody>
	);
};

export default AdvancedControls;
