/**
 * FinPress dependencies
 */
import { createSlotFill, PanelBody } from '@finpress/components';
import { usePluginContext } from '@finpress/plugins';
import { useDispatch, useSelect } from '@finpress/data';
import warning from '@finpress/warning';

/**
 * Internal dependencies
 */
import EnablePluginDocumentSettingPanelOption from '../preferences-modal/enable-plugin-document-setting-panel';
import { store as editorStore } from '../../store';

const { Fill, Slot } = createSlotFill( 'PluginDocumentSettingPanel' );

/**
 * Renders items below the Status & Availability panel in the Document Sidebar.
 *
 * @param {Object}                props                                 Component properties.
 * @param {string}                props.name                            Required. A machine-friendly name for the panel.
 * @param {string}                [props.className]                     An optional class name added to the row.
 * @param {string}                [props.title]                         The title of the panel
 * @param {FPBlockTypeIconRender} [props.icon=inherits from the plugin] The [Dashicon](https://developer.finpress.org/resource/dashicons/) icon slug string, or an SVG FP element, to be rendered when the sidebar is pinned to toolbar.
 * @param {React.ReactNode}       props.children                        Children to be rendered
 *
 * @example
 * ```js
 * // Using ES5 syntax
 * var el = React.createElement;
 * var __ = fp.i18n.__;
 * var registerPlugin = fp.plugins.registerPlugin;
 * var PluginDocumentSettingPanel = fp.editor.PluginDocumentSettingPanel;
 *
 * function MyDocumentSettingPlugin() {
 * 	return el(
 * 		PluginDocumentSettingPanel,
 * 		{
 * 			className: 'my-document-setting-plugin',
 * 			title: 'My Panel',
 * 			name: 'my-panel',
 * 		},
 * 		__( 'My Document Setting Panel' )
 * 	);
 * }
 *
 * registerPlugin( 'my-document-setting-plugin', {
 * 		render: MyDocumentSettingPlugin
 * } );
 * ```
 *
 * @example
 * ```jsx
 * // Using ESNext syntax
 * import { registerPlugin } from '@finpress/plugins';
 * import { PluginDocumentSettingPanel } from '@finpress/editor';
 *
 * const MyDocumentSettingTest = () => (
 * 		<PluginDocumentSettingPanel className="my-document-setting-plugin" title="My Panel" name="my-panel">
 *			<p>My Document Setting Panel</p>
 *		</PluginDocumentSettingPanel>
 *	);
 *
 *  registerPlugin( 'document-setting-test', { render: MyDocumentSettingTest } );
 * ```
 *
 * @return {React.ReactNode} The component to be rendered.
 */
const PluginDocumentSettingPanel = ( {
	name,
	className,
	title,
	icon,
	children,
} ) => {
	const { name: pluginName } = usePluginContext();
	const panelName = `${ pluginName }/${ name }`;
	const { opened, isEnabled } = useSelect(
		( select ) => {
			const { isEditorPanelOpened, isEditorPanelEnabled } =
				select( editorStore );

			return {
				opened: isEditorPanelOpened( panelName ),
				isEnabled: isEditorPanelEnabled( panelName ),
			};
		},
		[ panelName ]
	);
	const { toggleEditorPanelOpened } = useDispatch( editorStore );

	if ( undefined === name ) {
		warning( 'PluginDocumentSettingPanel requires a name property.' );
	}

	return (
		<>
			<EnablePluginDocumentSettingPanelOption
				label={ title }
				panelName={ panelName }
			/>
			<Fill>
				{ isEnabled && (
					<PanelBody
						className={ className }
						title={ title }
						icon={ icon }
						opened={ opened }
						onToggle={ () => toggleEditorPanelOpened( panelName ) }
					>
						{ children }
					</PanelBody>
				) }
			</Fill>
		</>
	);
};

PluginDocumentSettingPanel.Slot = Slot;

export default PluginDocumentSettingPanel;
