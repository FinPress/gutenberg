( function () {
	const el = fin.element.createElement;
	const Fragment = fin.element.Fragment;
	const __ = fin.i18n.__;
	const registerPlugin = fin.plugins.registerPlugin;
	const PluginPostPublishPanel = fin.editor.PluginPostPublishPanel;
	const PluginPrePublishPanel = fin.editor.PluginPrePublishPanel;

	function PanelContent() {
		return el( 'p', {}, __( 'Here is the panel content!' ) );
	}

	function MyPublishPanelPlugin() {
		return el(
			Fragment,
			{},
			el(
				PluginPrePublishPanel,
				{
					className: 'my-publish-panel-plugin__pre',
					title: __( 'My pre publish panel' ),
				},
				el( PanelContent, {} )
			),
			el(
				PluginPostPublishPanel,
				{
					className: 'my-publish-panel-plugin__post',
					title: __( 'My post publish panel' ),
				},
				el( PanelContent, {} )
			)
		);
	}

	registerPlugin( 'my-publish-panel-plugin', {
		render: MyPublishPanelPlugin,
	} );
} )();
