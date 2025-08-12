# Freeform Block

The Freeform block (also known as the Classic block) provides backward compatibility with the classic WordPress editor experience by embedding the TinyMCE editor within the block editor.

## Features

- **Classic Editor Integration**: Uses TinyMCE for familiar WordPress editing experience
- **Content Conversion**: Provides tools to convert classic content to modern blocks
- **Responsive Design**: Adapts to different screen sizes with modal editing
- **Backward Compatibility**: Maintains support for legacy WordPress content

## Usage

This block is primarily used in the post editor (`edit-post`) to provide backward compatibility for users transitioning from the classic editor to the block editor.

## Dependencies

The freeform block depends on:
- TinyMCE editor (`window.tinymce`, `window.wp.oldEditor`)
- WordPress block editor components
- WordPress icons (classic icon)

## Block Registration

The block is registered conditionally based on the availability of the classic editor:

```javascript
if (
    window?.wp?.oldEditor &&
    ( window?.wp?.needsClassicBlock ||
      ! window?.__experimentalDisableTinymce ||
      !! new URLSearchParams( window?.location?.search ).get('requiresTinymce') )
) {
    // Register the freeform block
}
```