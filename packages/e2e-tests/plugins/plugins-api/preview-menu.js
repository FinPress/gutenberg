( function () {
	const { __ } = fp.i18n;
	const { registerPlugin } = fp.plugins;
	const PluginPreviewMenuItem = fp.editor.PluginPreviewMenuItem;
	const el = fp.element.createElement;

	function CustomPreviewMenuItem() {
		return el( PluginPreviewMenuItem, {}, __( 'Custom Preview' ) );
	}

	registerPlugin( 'custom-preview-menu-item', {
		render: CustomPreviewMenuItem,
	} );
} )();
