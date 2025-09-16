( function () {
	const el = fin.element.createElement;
	const __ = fin.i18n.__;
	const registerPlugin = fin.plugins.registerPlugin;
	const PluginDocumentSettingPanel = fin.editor.PluginDocumentSettingPanel;

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
