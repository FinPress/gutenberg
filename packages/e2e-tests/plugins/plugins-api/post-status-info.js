( function () {
	const el = fp.element.createElement;
	const __ = fp.i18n.__;
	const registerPlugin = fp.plugins.registerPlugin;
	const PluginPostStatusInfo = fp.editor.PluginPostStatusInfo;

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
