# Table of Contents - Heading Visibility Controls

This enhancement adds the ability to control which headings appear in the Table of Contents block.

## Features

### 1. Individual Heading Controls

When a Table of Contents block is present in the editor, each heading block will automatically show a new "Table of Contents" panel in the Inspector Controls with a toggle to control its visibility in the TOC.

### 2. Centralized Management

The Table of Contents block itself includes a "Heading Visibility" panel in its Inspector Controls, allowing you to manage all headings from one location.

## How It Works

### For Heading Blocks:

1. Add a Table of Contents block to your post/page
2. Any existing or new heading blocks will automatically show a "Table of Contents" panel in their Inspector Controls
3. Use the "Show in Table of Contents" toggle to control visibility
4. When the TOC block is removed, these controls automatically disappear

### For Table of Contents Block:

1. In the TOC block's Inspector Controls, you'll find a "Heading Visibility" panel
2. This panel lists all headings in your post with individual toggles
3. You can quickly show/hide multiple headings from this central location
4. The "Reset All" option makes all headings visible again

## Technical Implementation

-   **No modifications to heading block core files**: All functionality is managed through the TOC block
-   **Dynamic controls**: Heading controls only appear when a TOC block exists
-   **Clean removal**: When TOC blocks are removed, all related controls disappear
-   **Multiple TOC support**: Works correctly with multiple TOC blocks in the same post

## Files Modified

-   `table-of-contents/block.json` - Added `hiddenHeadings` attribute
-   `table-of-contents/edit.js` - Added heading visibility management panel
-   `table-of-contents/hooks.js` - Modified to filter out hidden headings
-   `table-of-contents/index.js` - Added HOC registration
-   `table-of-contents/heading-controls.js` - New component for heading controls
-   `table-of-contents/with-heading-controls.js` - New HOC for adding controls to headings

## Usage Example

1. Create a post with several heading blocks
2. Add a Table of Contents block
3. Notice that each heading now has TOC visibility controls
4. Hide some headings using either the individual controls or the centralized panel
5. Observe that the TOC updates to reflect your choices
6. Remove the TOC block and notice the heading controls disappear
