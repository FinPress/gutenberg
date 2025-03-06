# Moving Animation Hook

The `useMovingAnimation` hook provides smooth animations for block movement in the WordPress block editor. It handles block reordering, dragging, and insertion animations while respecting user preferences and performance constraints.

## Development guidelines

### Usage

```jsx
import { useMovingAnimation } from '@wordpress/block-editor';

const MyBlock = ({ clientId }) => {
    const ref = useMovingAnimation({
        triggerAnimationOnChange: someValue,
        clientId,
    });

    return (
        <div ref={ref}>
            {/* Block content */}
        </div>
    );
};
```

### Parameters

#### Options Object

- **triggerAnimationOnChange**
  - **Type:** `any`
  - **Description:** Value that triggers the animation when changed

- **clientId**
  - **Type:** `string`
  - **Description:** The unique identifier for the block

### Return Value

- **Type:** `RefObject`
- **Description:** A ref object to attach to the block's DOM element

### Animation Behavior

The animation system works in three steps:
1. Renders the element in its final position
2. Takes a snapshot of the destination position
3. Animates from the previous position using CSS transforms

### Performance Considerations

Animations are automatically disabled when:
- User prefers reduced motion (`prefers-reduced-motion: reduce`)
- User is typing (for insertion animations)
- Block count exceeds `BLOCK_ANIMATION_THRESHOLD` (200 blocks)

```javascript
const BLOCK_ANIMATION_THRESHOLD = 200;
```

### Animation Configuration

Default spring animation parameters:
- Mass: 5
- Tension: 2000
- Friction: 200

```javascript
config: { mass: 5, tension: 2000, friction: 200 }
```

## Related Components

Block Editor components are components that can be used to compose the UI of your block editor. They should be used under a [`BlockEditorProvider`](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/provider/README.md) in the components tree.
