/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
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
	const { displayLoginAsForm, redirectToCurrent, formData, showRememberMe } =
		attributes;
	const [ isEditingForm, setIsEditingForm ] = useState( displayLoginAsForm );
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
						<>
							<ToolsPanelItem
								label={ __( 'View Login Form' ) }
								isShownByDefault
								hasValue={ () => ! isEditingForm }
								onDeselect={ () => setIsEditingForm( true ) }
							>
								<ToggleControl
									__nextHasNoMarginBottom
									label={ __( 'View Login Form' ) }
									checked={ isEditingForm }
									onChange={ () =>
										setIsEditingForm( ! isEditingForm )
									}
								/>
							</ToolsPanelItem>
							<ToolsPanelItem
								label={ __( 'Show Remember Field' ) }
								isShownByDefault
								hasValue={ () => ! showRememberMe }
								onDeselect={ () => {
									setAttributes( {
										showRememberMe: true,
									} );
								} }
							>
								<ToggleControl
									__nextHasNoMarginBottom
									label={ __( 'Show Remember Form' ) }
									checked={ showRememberMe }
									onChange={ () =>
										setAttributes( {
											showRememberMe: ! showRememberMe,
										} )
									}
								/>
							</ToolsPanelItem>
						</>
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
					<div className="wp-block-loginout-form">
						<div className="wp-block-loginout-form__fields">
							<RichText
								tagName="label"
								value={ formData.usernameLabel ?? 'Username' }
								onChange={ ( usernameLabel ) =>
									setAttributes( {
										formData: {
											...formData,
											usernameLabel,
										},
									} )
								}
							/>

							<input
								type="text"
								placeholder="Username"
								disabled
							/>
						</div>
						<div className="wp-block-loginout-form__fields">
							<RichText
								tagName="label"
								value={ formData.passwordLabel ?? 'Password' }
								onChange={ ( passwordLabel ) =>
									setAttributes( {
										formData: {
											...formData,
											passwordLabel,
										},
									} )
								}
							/>
							<input
								type="password"
								placeholder="Password"
								disabled
							/>
						</div>
						{ /* Remember me checkbox */ }
						{ !! showRememberMe && (
							<div className="wp-block-loginout-form__fields">
								<input type="checkbox" disabled />

								<RichText
									tagName="label"
									value={
										formData.rememberLabel ?? 'Remember me'
									}
									onChange={ ( rememberLabel ) =>
										setAttributes( {
											formData: {
												...formData,
												rememberLabel,
											},
										} )
									}
								/>
							</div>
						) }

						<div className="wp-block-loginout-form__fields">
							<RichText
								tagName="button"
								value={ formData.submitLabel ?? 'Log in' }
								onChange={ ( submitLabel ) =>
									setAttributes( {
										formData: { ...formData, submitLabel },
									} )
								}
							/>
						</div>
					</div>
				) : (
					<a href="#login-pseudo-link">{ __( 'Log out' ) }</a>
				) }
			</div>
		</>
	);
}
