( function () {
	fin.richText.registerFormatType( 'my-plugin/link', {
		title: 'Custom Link',
		tagName: 'a',
		attributes: {
			url: 'href',
		},
		className: 'my-plugin-link',
		edit( props ) {
			return fin.element.createElement(
				fin.blockEditor.RichTextToolbarButton,
				{
					icon: 'admin-links',
					title: 'Custom Link',
					onClick() {
						props.onChange(
							fin.richText.toggleFormat( props.value, {
								type: 'my-plugin/link',
								attributes: {
									url: 'https://example.com',
								},
							} )
						);
					},
					isActive: props.isActive,
				}
			);
		},
	} );
} )();
