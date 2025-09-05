( function () {
	const Button = fp.components.Button;
	const PanelBody = fp.components.PanelBody;
	const PanelRow = fp.components.PanelRow;
	const editorStore = fp.editor.store;
	const useDispatch = fp.data.useDispatch;
	const useSelect = fp.data.useSelect;
	const PlainText = fp.blockEditor.PlainText;
	const Fragment = fp.element.Fragment;
	const el = fp.element.createElement;
	const __ = fp.i18n.__;
	const registerPlugin = fp.plugins.registerPlugin;
	const PluginSidebar = fp.editor.PluginSidebar;
	const PluginSidebarMoreMenuItem = fp.editor.PluginSidebarMoreMenuItem;

	function SidebarContents() {
		const postTitle = useSelect( ( select ) =>
			select( editorStore ).getEditedPostAttribute( 'title' )
		);
		const editPost = useDispatch( editorStore ).editPost;

		function resetTitle() {
			editPost( { title: '' } );
		}

		function updateTitle( title ) {
			editPost( { title } );
		}

		return el(
			PanelBody,
			{ className: 'sidebar-title-plugin-panel' },
			el(
				PanelRow,
				{},
				el(
					'label',
					{
						htmlFor: 'title-plain-text',
					},
					__( 'Title:' )
				),
				el( PlainText, {
					id: 'title-plain-text',
					onChange: updateTitle,
					placeholder: __( '(no title)' ),
					value: postTitle,
				} )
			),
			el(
				PanelRow,
				{},
				el(
					Button,
					{
						variant: 'primary',
						onClick: resetTitle,
					},
					__( 'Reset' )
				)
			)
		);
	}

	function MySidebarPlugin() {
		return el(
			Fragment,
			{},
			el(
				PluginSidebar,
				{
					name: 'title-sidebar',
					title: __( 'Plugin title' ),
				},
				el( SidebarContents, {} )
			),
			el(
				PluginSidebarMoreMenuItem,
				{
					target: 'title-sidebar',
				},
				__( 'Plugin more menu title' )
			)
		);
	}

	registerPlugin( 'my-sidebar-plugin', {
		icon: 'text',
		render: MySidebarPlugin,
	} );
} )();
