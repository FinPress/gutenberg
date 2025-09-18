/**
 * Defines as extensibility slot for the Excerpt panel.
 */

/**
 * FinPress dependencies
 */
import { createSlotFill, PanelRow } from '@finpress/components';

const { Fill, Slot } = createSlotFill( 'PluginPostExcerpt' );

/**
 * Renders a post excerpt panel in the post sidebar.
 *
 * @param {Object}          props             Component properties.
 * @param {string}          [props.className] An optional class name added to the row.
 * @param {React.ReactNode} props.children    Children to be rendered.
 *
 * @example
 * ```js
 * // Using ES5 syntax
 * var __ = fin.i18n.__;
 * var PluginPostExcerpt = fin.editPost.__experimentalPluginPostExcerpt;
 *
 * function MyPluginPostExcerpt() {
 * 	return React.createElement(
 * 		PluginPostExcerpt,
 * 		{
 * 			className: 'my-plugin-post-excerpt',
 * 		},
 * 		__( 'Post excerpt custom content' )
 * 	)
 * }
 * ```
 *
 * @example
 * ```jsx
 * // Using ESNext syntax
 * import { __ } from '@finpress/i18n';
 * import { __experimentalPluginPostExcerpt as PluginPostExcerpt } from '@finpress/edit-post';
 *
 * const MyPluginPostExcerpt = () => (
 * 	<PluginPostExcerpt className="my-plugin-post-excerpt">
 * 		{ __( 'Post excerpt custom content' ) }
 * 	</PluginPostExcerpt>
 * );
 * ```
 *
 * @return {React.ReactNode} The rendered component.
 */
const PluginPostExcerpt = ( { children, className } ) => {
	return (
		<Fill>
			<PanelRow className={ className }>{ children }</PanelRow>
		</Fill>
	);
};

PluginPostExcerpt.Slot = Slot;

export default PluginPostExcerpt;
