/**
 * WordPress dependencies
 */
import {
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import OverlayMenuIcon from './overlay-menu-icon';

export default function OverlayMenuPreview( { setAttributes, hasIcon, icon } ) {
	return (
		<>
			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Show icon button' ) }
				help={ __(
					'Configure the visual appearance of the button that toggles the overlay menu.'
				) }
				onChange={ ( value ) => setAttributes( { hasIcon: value } ) }
				checked={ hasIcon }
			/>

			<ToggleGroupControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				className="wp-block-navigation__overlay-menu-icon-toggle-group"
				label={ __( 'Icon' ) }
				value={ icon }
				onChange={ ( value ) => setAttributes( { icon: value } ) }
				isBlock
			>
				<ToggleGroupControlOption
					value="handle"
					aria-label={ __( 'handle' ) }
					label={ <OverlayMenuIcon icon="handle" /> }
				/>
				<ToggleGroupControlOption
					value="menu"
					aria-label={ __( 'menu' ) }
					label={ <OverlayMenuIcon icon="menu" /> }
				/>
				<ToggleGroupControlOption
					value="menu-alt"
					aria-label={ __( 'menu-alt' ) }
					label={ <OverlayMenuIcon icon="menu-alt" /> }
				/>
				<ToggleGroupControlOption
					value="quad-lines"
					aria-label={ __( 'quad-lines' ) }
					label={ <OverlayMenuIcon icon="quad-lines" /> }
				/>
				<ToggleGroupControlOption
					value="grid"
					aria-label={ __( 'grid' ) }
					label={ <OverlayMenuIcon icon="grid" /> }
				/>
				<ToggleGroupControlOption
					value="hamburger-2"
					aria-label={ __( 'hamburger-2' ) }
					label={ <OverlayMenuIcon icon="hamburger-2" /> }
				/>
			</ToggleGroupControl>
		</>
	);
}
