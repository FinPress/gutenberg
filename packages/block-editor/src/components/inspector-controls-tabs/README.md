# Inspector Controls Tabs

The `InspectorControlsTabs` component provides a tabbed interface within the Inspector Controls sidebar of the WordPress Block Editor, allowing you to organize block settings into logical groups for better user experience.

## Description

The `InspectorControlsTabs` component helps reduce visual clutter in the sidebar by organizing related settings into tabs. This is particularly useful for blocks with numerous settings that can be logically grouped into different categories.

## Installation

This component is part of the `@wordpress/block-editor` package. If you're developing with WordPress, it should already be available in your environment.

```bash
npm install @wordpress/block-editor
```

## Usage

```jsx
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { InspectorControlsTabs } from '@wordpress/block-editor';

function MyBlockEdit({ attributes, setAttributes }) {
    return (
        <>
            <InspectorControls>
                <InspectorControlsTabs>
                    <InspectorControlsTabs.Tab name="style" title="Style">
                        <PanelBody title="Style Settings">
                            {/* Style-related controls */}
                        </PanelBody>
                    </InspectorControlsTabs.Tab>

                    <InspectorControlsTabs.Tab name="advanced" title="Advanced">
                        <PanelBody title="Advanced Settings">
                            {/* Advanced controls */}
                        </PanelBody>
                    </InspectorControlsTabs.Tab>
                </InspectorControlsTabs>
            </InspectorControls>

            {/* Block content */}
        </>
    );
}
```

## Props

### InspectorControlsTabs

The main wrapper component that creates the tabbed interface.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | Node | - | Tab components to be rendered |

### InspectorControlsTabs.Tab

Individual tab component that wraps the content for each tab.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| name | string | Yes | Unique identifier for the tab |
| title | string | Yes | Display title for the tab |
| children | Node | Yes | Content to be displayed when tab is active |

## Examples

### Basic Usage

```jsx
import { InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    ColorPicker
} from '@wordpress/components';
import { InspectorControlsTabs } from '@wordpress/block-editor';

function MyBlockEdit({ attributes, setAttributes }) {
    const { text, backgroundColor } = attributes;

    return (
        <>
            <InspectorControls>
                <InspectorControlsTabs>
                    <InspectorControlsTabs.Tab name="content" title="Content">
                        <PanelBody>
                            <TextControl
                                label="Text Content"
                                value={text}
                                onChange={(value) => setAttributes({ text: value })}
                            />
                        </PanelBody>
                    </InspectorControlsTabs.Tab>

                    <InspectorControlsTabs.Tab name="style" title="Style">
                        <PanelBody>
                            <ColorPicker
                                label="Background Color"
                                color={backgroundColor}
                                onChange={(value) => setAttributes({ backgroundColor: value })}
                            />
                        </PanelBody>
                    </InspectorControlsTabs.Tab>
                </InspectorControlsTabs>
            </InspectorControls>

            <div style={{ backgroundColor }}>
                {text}
            </div>
        </>
    );
}
```

### Multiple Panels in a Tab

```jsx
<InspectorControlsTabs>
    <InspectorControlsTabs.Tab name="style" title="Style">
        <PanelBody title="Colors">
            {/* Color controls */}
        </PanelBody>
        <PanelBody title="Typography">
            {/* Typography controls */}
        </PanelBody>
        <PanelBody title="Spacing">
            {/* Spacing controls */}
        </PanelBody>
    </InspectorControlsTabs.Tab>
</InspectorControlsTabs>
```

## Best Practices

1. Group related controls together in the same tab
2. Use clear, concise tab names that describe the contained settings
3. Order tabs from most to least commonly used
4. Keep the number of tabs reasonable (3-4 maximum recommended)
5. Ensure tab names are consistent with WordPress conventions

## Related Components

- [`InspectorControls`](https://github.com/WordPress/gutenberg/tree/trunk/packages/block-editor/src/components/inspector-controls)
- [`PanelBody`](https://github.com/WordPress/gutenberg/tree/trunk/packages/components/src/panel)
