/**
 * WordPress dependencies
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';

export default function LoginOutEdit( { attributes, setAttributes } ) {
	const { displayLoginAsForm, redirectToCurrent } = attributes;
	const [ isEditingForm, setIsEditingForm ] = useState( false );
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => {
						setAttributes( {
							displayLoginAsForm: false,
							redirectToCurrent: true,
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Display login as form' ) }
						isShownByDefault
						hasValue={ () => displayLoginAsForm }
						onDeselect={ () =>
							setAttributes( { displayLoginAsForm: false } )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Display login as form' ) }
							checked={ displayLoginAsForm }
							onChange={ () =>
								setAttributes( {
									displayLoginAsForm: ! displayLoginAsForm,
								} )
							}
						/>
					</ToolsPanelItem>
					{ displayLoginAsForm && (
						<ToolsPanelItem
							label={ __( 'Show Login Form' ) }
							isShownByDefault
							hasValue={ () => ! isEditingForm }
							onDeselect={ () => setIsEditingForm( true ) }
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Show Login Form' ) }
								checked={ isEditingForm }
								onChange={ () =>
									setIsEditingForm( ! isEditingForm )
								}
							/>
						</ToolsPanelItem>
					) }
					<ToolsPanelItem
						label={ __( 'Redirect to current URL' ) }
						isShownByDefault
						hasValue={ () => ! redirectToCurrent }
						onDeselect={ () =>
							setAttributes( { redirectToCurrent: true } )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Redirect to current URL' ) }
							checked={ redirectToCurrent }
							onChange={ () =>
								setAttributes( {
									redirectToCurrent: ! redirectToCurrent,
								} )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<div
				{ ...useBlockProps( {
					className: 'logged-in',
				} ) }
			>
				{ isEditingForm ? (
					<>show Form</>
				) : (
					<a href="#login-pseudo-link">{ __( 'Log out' ) }</a>
				) }
			</div>
		</>
	);
}
