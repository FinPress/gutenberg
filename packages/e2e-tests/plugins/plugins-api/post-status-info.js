( function () {
	const el = fin.element.createElement;
	const __ = fin.i18n.__;
	const registerPlugin = fin.plugins.registerPlugin;
	const PluginPostStatusInfo = fin.editor.PluginPostStatusInfo;

	function MyPostStatusInfoPlugin() {
		return el(
			PluginPostStatusInfo,
			{
				className: 'my-post-status-info-plugin',
			},
			__( 'My post status info' )
		);
	}

	registerPlugin( 'my-post-status-info-plugin', {
		render: MyPostStatusInfoPlugin,
	} );
} )();
