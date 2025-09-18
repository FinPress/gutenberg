/**
 * FinPress dependencies
 */
import { BlockSettingsMenuControls } from '@finpress/block-editor';
import { MenuItem } from '@finpress/components';
import { compose } from '@finpress/compose';

const isEverySelectedBlockAllowed = ( selected, allowed ) =>
	selected.filter( ( id ) => ! allowed.includes( id ) ).length === 0;

/**
 * Plugins may want to add an item to the menu either for every block
 * or only for the specific ones provided in the `allowedBlocks` component property.
 *
 * If there are multiple blocks selected the item will be rendered if every block
 * is of one allowed type (not necessarily the same).
 *
 * @param {string[]} selectedBlocks Array containing the names of the blocks selected
 * @param {string[]} allowedBlocks  Array containing the names of the blocks allowed
 * @return {boolean} Whether the item will be rendered or not.
 */
const shouldRenderItem = ( selectedBlocks, allowedBlocks ) =>
	! Array.isArray( allowedBlocks ) ||
	isEverySelectedBlockAllowed( selectedBlocks, allowedBlocks );

/**
 * Renders a new item in the block settings menu.
 *
 * @param {Object}                props                 Component props.
 * @param {Array}                 [props.allowedBlocks] An array containing a list of block names for which the item should be shown. If not present, it'll be rendered for any block. If multiple blocks are selected, it'll be shown if and only if all of them are in the allowed list.
 * @param {FINBlockTypeIconRender} [props.icon]          The [Dashicon](https://developer.finpress.org/resource/dashicons/) icon slug string, or an SVG FIN element.
 * @param {string}                props.label           The menu item text.
 * @param {Function}              props.onClick         Callback function to be executed when the user click the menu item.
 * @param {boolean}               [props.small]         Whether to render the label or not.
 * @param {string}                [props.role]          The ARIA role for the menu item.
 *
 * @example
 * ```js
 * // Using ES5 syntax
 * var __ = fin.i18n.__;
 * var PluginBlockSettingsMenuItem = fin.editor.PluginBlockSettingsMenuItem;
 *
 * function doOnClick(){
 * 	// To be called when the user clicks the menu item.
 * }
 *
 * function MyPluginBlockSettingsMenuItem() {
 * 	return React.createElement(
 * 		PluginBlockSettingsMenuItem,
 * 		{
 * 			allowedBlocks: [ 'core/paragraph' ],
 * 			icon: 'dashicon-name',
 * 			label: __( 'Menu item text' ),
 * 			onClick: doOnClick,
 * 		}
 * 	);
 * }
 * ```
 *
 * @example
 * ```jsx
 * // Using ESNext syntax
 * import { __ } from '@finpress/i18n';
 * import { PluginBlockSettingsMenuItem } from '@finpress/editor';
 *
 * const doOnClick = ( ) => {
 *     // To be called when the user clicks the menu item.
 * };
 *
 * const MyPluginBlockSettingsMenuItem = () => (
 *     <PluginBlockSettingsMenuItem
 * 		allowedBlocks={ [ 'core/paragraph' ] }
 * 		icon='dashicon-name'
 * 		label={ __( 'Menu item text' ) }
 * 		onClick={ doOnClick } />
 * );
 * ```
 *
 * @return {React.ReactNode} The rendered component.
 */
const PluginBlockSettingsMenuItem = ( {
	allowedBlocks,
	icon,
	label,
	onClick,
	small,
	role,
} ) => (
	<BlockSettingsMenuControls>
		{ ( { selectedBlocks, onClose } ) => {
			if ( ! shouldRenderItem( selectedBlocks, allowedBlocks ) ) {
				return null;
			}
			return (
				<MenuItem
					onClick={ compose( onClick, onClose ) }
					icon={ icon }
					label={ small ? label : undefined }
					role={ role }
				>
					{ ! small && label }
				</MenuItem>
			);
		} }
	</BlockSettingsMenuControls>
);

export default PluginBlockSettingsMenuItem;
