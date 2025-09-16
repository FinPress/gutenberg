( function () {
	const { __ } = fin.i18n;
	const { registerPlugin } = fin.plugins;
	const PluginPreviewMenuItem = fin.editor.PluginPreviewMenuItem;
	const el = fin.element.createElement;

	function CustomPreviewMenuItem() {
		return el( PluginPreviewMenuItem, {}, __( 'Custom Preview' ) );
	}

	registerPlugin( 'custom-preview-menu-item', {
		render: CustomPreviewMenuItem,
	} );
} )();
