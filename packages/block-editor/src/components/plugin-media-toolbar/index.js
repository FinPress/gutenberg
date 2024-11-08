/**
 * Defines as extensibility slot for the MediaReplaceFlow component used by Image & Cover blocks.
 */

/**
 * WordPress dependencies
 */
import { createSlotFill, MenuItem } from '@wordpress/components';

const { Fill, Slot } = createSlotFill( 'PluginMediaToolbar' );

/**
 * Renders provided option as a menu item in the block toolbar for image and cover blocks.
 *
 * @param {Object}                props             Component props.
 * @param {string}                [props.className] Class name to be applied to the menu item.
 * @param {WPBlockTypeIconRender} [props.icon]      Optional icon to be rendered next to the menu item.
 * @param {Function}              [props.onClick]   Optional click handler for the menu item.
 * @param {Element}               props.children    The content of the menu item.
 *
 * @example
 * ```jsx
 * // Using ESNext syntax
 * import { __ } from '@wordpress/i18n';
 * import { share } from "@wordpress/icons";
 * import { PluginMediaToolbar } from '@wordpress/block-editor';
 *
 * const MyPluginMediaToolbar = () => (
 * 	<PluginMediaToolbar
 * 		className="my-plugin-media-toolbar"
 * 		icon={ share }
 * 		onClick={ () => console.log( 'Extended Menu clicked!' ) }
 * 	>
 *         { __( 'Extended Menu' ) }
 * 	</PluginMediaToolbar>
 * );
 * ```
 *
 * @return {Component} The rendered menu item.
 */
const PluginMediaToolbar = ( {
	children,
	className,
	icon,
	onClick,
	...props
} ) => (
	<Fill>
		<MenuItem
			className={ className }
			icon={ icon }
			onClick={ onClick }
			{ ...props }
		>
			{ children }
		</MenuItem>
	</Fill>
);

PluginMediaToolbar.Slot = Slot;

export default PluginMediaToolbar;
