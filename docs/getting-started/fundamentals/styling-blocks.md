# Styling blocks

WordPress blocks provide multiple ways to style and customize their appearance. This guide covers the core styling mechanisms available to block developers and how to implement them effectively.

## Core styling mechanisms

Block styling in WordPress can be implemented through several approaches:

- Block-specific CSS classes
- Style variations
- Custom CSS properties (CSS variables)
- Theme.json configurations
- Dynamic styles through attributes
- Block supports API

### Block-specific CSS classes

Every block automatically receives CSS classes that can be used for styling:

- `wp-block-{namespace}-{blockname}` - The main block class
- `is-style-{stylename}` - Applied when a style variation is selected
- `align{value}` - Applied for block alignment options

*Example: Basic block CSS structure*
```css
.wp-block-example-myblock {
    background: #ffffff;
    padding: 20px;
}

.wp-block-example-myblock.is-style-boxed {
    border: 1px solid #ddd;
    border-radius: 4px;
}
```

### Style variations

Style variations allow users to switch between predefined styles for a block. They are registered during block registration and can be selected through the block toolbar or sidebar.

*Example: Registering block style variations*
```js
registerBlockType('example/myblock', {
    // ... other block configurations
    styles: [
        {
            name: 'default',
            label: __('Default'),
            isDefault: true
        },
        {
            name: 'boxed',
            label: __('Boxed')
        }
    ]
});
```

### Theme.json integration

The `theme.json` configuration allows you to define default styles, presets, and customization options for your blocks:

```json
{
    "version": 2,
    "styles": {
        "blocks": {
            "example/myblock": {
                "color": {
                    "background": "var(--wp--preset--color--background)",
                    "text": "var(--wp--preset--color--foreground)"
                },
                "spacing": {
                    "padding": "2rem"
                }
            }
        }
    }
}
```

### Block Supports API

The Block Supports API enables common styling features without additional code:

```js
registerBlockType('example/myblock', {
    // ... other block configurations
    supports: {
        color: {
            background: true,
            text: true,
            gradients: true
        },
        spacing: {
            padding: true,
            margin: true
        },
        typography: {
            fontSize: true,
            lineHeight: true
        }
    }
});
```

### Dynamic styles through attributes

Blocks can use attributes to store and apply dynamic styles:

```js
registerBlockType('example/myblock', {
    attributes: {
        backgroundColor: {
            type: 'string',
            default: '#ffffff'
        }
    },
    edit: ({ attributes, setAttributes }) => {
        return (
            <div style={{ backgroundColor: attributes.backgroundColor }}>
                {/* Block content */}
            </div>
        );
    }
});
```

## Best practices

1. **Progressive enhancement**: Start with basic styles and layer on additional features through Block Supports API
2. **Theme compatibility**: Use CSS custom properties and theme.json for better theme integration
3. **Responsive design**: Implement styles that work across different screen sizes
4. **Performance**: Minimize CSS specificity and avoid unnecessary style variations
5. **Accessibility**: Ensure sufficient color contrast and maintain readability

## Common styling patterns

### Content width and alignment
```css
/* Full-width and wide alignment */
.alignfull {
    width: 100%;
    max-width: none;
}

.alignwide {
    max-width: var(--wp--style--global--wide-size);
    margin-left: auto;
    margin-right: auto;
}
```

### Responsive behavior
```css
/* Responsive media queries */
@media (max-width: 781px) {
    .wp-block-example-myblock {
        padding: 16px;
    }
}
```

## Troubleshooting

Common styling issues and solutions:

1. **Style conflicts**: Use specific selectors and the `!important` flag sparingly
2. **Theme compatibility**: Test with different themes and use theme.json for better integration
3. **Editor vs Frontend**: Ensure styles work in both contexts by testing in the editor and on the frontend

## Additional Resources

- [Block Editor Handbook: Styling Components](https://developer.wordpress.org/block-editor/reference-guides/components/style-system/)
- [Theme.json documentation](https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/)
- [Block Supports API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
- [CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)
