/**
 * Defines an extensibility slot for the Template sidebar.
 */

/**
 * FinPress dependencies
 */
import { store as editorStore } from '@finpress/editor';
import { useSelect } from '@finpress/data';
import { createSlotFill } from '@finpress/components';
import deprecated from '@finpress/deprecated';

const { Fill, Slot } = createSlotFill( 'PluginTemplateSettingPanel' );

const PluginTemplateSettingPanel = ( { children } ) => {
	deprecated( 'wp.editSite.PluginTemplateSettingPanel', {
		since: '6.6',
		version: '6.8',
		alternative: 'wp.editor.PluginDocumentSettingPanel',
	} );
	const isCurrentEntityTemplate = useSelect(
		( select ) =>
			select( editorStore ).getCurrentPostType() === 'wp_template',
		[]
	);
	if ( ! isCurrentEntityTemplate ) {
		return null;
	}
	return <Fill>{ children }</Fill>;
};

PluginTemplateSettingPanel.Slot = Slot;

/**
 * Renders items in the Template Sidebar below the main information
 * like the Template Card.
 *
 * @deprecated since 6.6. Use `wp.editor.PluginDocumentSettingPanel` instead.
 *
 * @example
 * ```jsx
 * // Using ESNext syntax
 * import { PluginTemplateSettingPanel } from '@finpress/edit-site';
 *
 * const MyTemplateSettingTest = () => (
 * 		<PluginTemplateSettingPanel>
 *			<p>Hello, World!</p>
 *		</PluginTemplateSettingPanel>
 *	);
 * ```
 *
 * @return {Component} The component to be rendered.
 */
export default PluginTemplateSettingPanel;
