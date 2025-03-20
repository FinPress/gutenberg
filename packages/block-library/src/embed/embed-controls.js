/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	ToolbarButton,
	ToggleControl,
	ToolbarGroup,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { edit } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';
import { getClassNames } from './util';

function getResponsiveHelp( checked ) {
	return checked
		? __(
				'This embed will preserve its aspect ratio when the browser is resized.'
		  )
		: __(
				'This embed may not preserve its aspect ratio when the browser is resized.'
		  );
}

const EmbedControls = ( {
	blockSupportsResponsive,
	showEditButton,
	themeSupportsResponsive,
	allowResponsive,
	toggleResponsive,
	switchBackToURLInput,
	html,
	attributes,
	setAttributes,
} ) => {
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();
	const { responsive, className } = attributes;
	const newAllowResponsive = ! allowResponsive;

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					{ showEditButton && (
						<ToolbarButton
							className="components-toolbar__control"
							label={ __( 'Edit URL' ) }
							icon={ edit }
							onClick={ switchBackToURLInput }
						/>
					) }
				</ToolbarGroup>
			</BlockControls>
			{ themeSupportsResponsive && blockSupportsResponsive && (
				<InspectorControls>
					<ToolsPanel
						label={ __( 'Media settings' ) }
						resetAll={ () => {
							setAttributes( {
								allowResponsive: true,
								className: getClassNames(
									html,
									className,
									responsive && newAllowResponsive
								),
								responsive: true,
							} );
						} }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							label={ __( 'Media settings' ) }
							isShownByDefault
							hasValue={ () => ! allowResponsive || ! responsive }
							onDeselect={ () =>
								setAttributes( {
									allowResponsive: true,
									className: getClassNames(
										html,
										className,
										responsive && newAllowResponsive
									),
									responsive: true,
								} )
							}
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Resize for smaller devices' ) }
								checked={ allowResponsive }
								help={ getResponsiveHelp }
								onChange={ toggleResponsive }
							/>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
			) }
		</>
	);
};

export default EmbedControls;
