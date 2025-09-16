( function () {
	const Button = fin.components.Button;
	const PanelBody = fin.components.PanelBody;
	const PanelRow = fin.components.PanelRow;
	const editorStore = fin.editor.store;
	const useDispatch = fin.data.useDispatch;
	const useSelect = fin.data.useSelect;
	const PlainText = fin.blockEditor.PlainText;
	const Fragment = fin.element.Fragment;
	const el = fin.element.createElement;
	const __ = fin.i18n.__;
	const registerPlugin = fin.plugins.registerPlugin;
	const PluginSidebar = fin.editor.PluginSidebar;
	const PluginSidebarMoreMenuItem = fin.editor.PluginSidebarMoreMenuItem;

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
