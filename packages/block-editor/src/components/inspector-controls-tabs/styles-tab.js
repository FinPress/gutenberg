/**
 * WordPress dependencies
 */
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BlockStyles from '../block-styles';
import { getDefaultStyle } from '../block-styles/utils';
import useStylesForBlocks from '../block-styles/use-styles-for-block';
import InspectorControls from '../inspector-controls';
import { useBorderPanelLabel } from '../../hooks/border';
import { useToolsPanelDropdownMenuProps } from '../global-styles/utils';

const noop = () => {};

const StylesTab = ( { blockName, clientId, hasBlockStyles } ) => {
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();
	const borderPanelLabel = useBorderPanelLabel( { blockName } );
	const { onSelect, stylesToRender, activeStyle } = useStylesForBlocks( {
		clientId,
		onSwitch: noop,
	} );

	const defaultStyle = getDefaultStyle( stylesToRender );

	return (
		<>
			{ hasBlockStyles && (
				<div>
					<ToolsPanel
						label={ __( 'Styles' ) }
						resetAll={ () => {
							onSelect( undefined );
						} }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							isShownByDefault
							hasValue={ () => activeStyle !== defaultStyle }
							label={ __( 'Styles' ) }
							onDeselect={ () => onSelect( undefined ) }
						>
							<BlockStyles clientId={ clientId } />
						</ToolsPanelItem>
					</ToolsPanel>
				</div>
			) }
			<InspectorControls.Slot
				group="color"
				label={ __( 'Color' ) }
				className="color-block-support-panel__inner-wrapper"
			/>
			<InspectorControls.Slot
				group="background"
				label={ __( 'Background image' ) }
			/>
			<InspectorControls.Slot group="filter" />
			<InspectorControls.Slot
				group="typography"
				label={ __( 'Typography' ) }
			/>
			<InspectorControls.Slot
				group="dimensions"
				label={ __( 'Dimensions' ) }
			/>
			<InspectorControls.Slot group="border" label={ borderPanelLabel } />
			<InspectorControls.Slot group="styles" />
		</>
	);
};

export default StylesTab;
