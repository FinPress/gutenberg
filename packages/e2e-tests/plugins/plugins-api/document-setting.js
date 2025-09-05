( function () {
	const el = fp.element.createElement;
	const __ = fp.i18n.__;
	const registerPlugin = fp.plugins.registerPlugin;
	const PluginDocumentSettingPanel = fp.editor.PluginDocumentSettingPanel;

	function MyDocumentSettingPlugin() {
		return el(
			PluginDocumentSettingPanel,
			{
				className: 'my-document-setting-plugin',
				title: 'My Custom Panel',
				name: 'my-custom-panel',
			},
			__( 'My Document Setting Panel' )
		);
	}

	registerPlugin( 'my-document-setting-plugin', {
		render: MyDocumentSettingPlugin,
	} );
} )();
