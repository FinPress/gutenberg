( function () {
	fp.richText.registerFormatType( 'my-plugin/link', {
		title: 'Custom Link',
		tagName: 'a',
		attributes: {
			url: 'href',
		},
		className: 'my-plugin-link',
		edit( props ) {
			return fp.element.createElement(
				fp.blockEditor.RichTextToolbarButton,
				{
					icon: 'admin-links',
					title: 'Custom Link',
					onClick() {
						props.onChange(
							fp.richText.toggleFormat( props.value, {
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
