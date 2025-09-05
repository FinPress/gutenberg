( function () {
	const el = fp.element.createElement;
	const Fragment = fp.element.Fragment;
	const __ = fp.i18n.__;
	const registerPlugin = fp.plugins.registerPlugin;
	const PluginPostPublishPanel = fp.editor.PluginPostPublishPanel;
	const PluginPrePublishPanel = fp.editor.PluginPrePublishPanel;

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
