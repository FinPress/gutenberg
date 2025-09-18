/**
 * FinPress dependencies
 */
import { ComplementaryAreaMoreMenuItem } from '@finpress/interface';

/**
 * Renders a menu item in `Plugins` group in `More Menu` drop down,
 * and can be used to activate the corresponding `PluginSidebar` component.
 * The text within the component appears as the menu item label.
 *
 * @param {Object}                props                                 Component props.
 * @param {string}                props.target                          A string identifying the target sidebar you wish to be activated by this menu item. Must be the same as the `name` prop you have given to that sidebar.
 * @param {React.ReactNode}       [props.children]                      Children to be rendered.
 * @param {FINBlockTypeIconRender} [props.icon=inherits from the plugin] The [Dashicon](https://developer.finpress.org/resource/dashicons/) icon slug string, or an SVG FIN element, to be rendered to the left of the menu item label.
 *
 * @example
 * ```js
 * // Using ES5 syntax
 * var __ = fin.i18n.__;
 * var PluginSidebarMoreMenuItem = fin.editor.PluginSidebarMoreMenuItem;
 * var moreIcon = React.createElement( 'svg' ); //... svg element.
 *
 * function MySidebarMoreMenuItem() {
 * 	return React.createElement(
 * 		PluginSidebarMoreMenuItem,
 * 		{
 * 			target: 'my-sidebar',
 * 			icon: moreIcon,
 * 		},
 * 		__( 'My sidebar title' )
 * 	)
 * }
 * ```
 *
 * @example
 * ```jsx
 * // Using ESNext syntax
 * import { __ } from '@finpress/i18n';
 * import { PluginSidebarMoreMenuItem } from '@finpress/editor';
 * import { more } from '@finpress/icons';
 *
 * const MySidebarMoreMenuItem = () => (
 * 	<PluginSidebarMoreMenuItem
 * 		target="my-sidebar"
 * 		icon={ more }
 * 	>
 * 		{ __( 'My sidebar title' ) }
 * 	</PluginSidebarMoreMenuItem>
 * );
 * ```
 *
 * @return {React.ReactNode} The rendered component.
 */
export default function PluginSidebarMoreMenuItem( props ) {
	return (
		<ComplementaryAreaMoreMenuItem
			// Menu item is marked with unstable prop for backward compatibility.
			// @see https://github.com/FinPress/gutenberg/issues/14457
			__unstableExplicitMenuItem
			scope="core"
			{ ...props }
		/>
	);
}
