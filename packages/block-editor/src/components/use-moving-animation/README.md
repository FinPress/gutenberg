# useMovingAnimation

The `useMovingAnimation` hook provides animated transitions for moving blocks in the WordPress editor. It calculates position changes and applies smooth transformations using `react-spring`.

## How It Works

This animation works as follows:

1. Initially, the element is rendered in its new position.
2. A snapshot of its position is taken as a reference.
3. The element is moved back to its previous position using a CSS transform.
4. The animation smoothly transitions the element to its new position.
5. If necessary, scrolling adjustments are made to preserve the user's viewport position.

## Usage

```jsx
import useMovingAnimation from './useMovingAnimation';

const MyAnimatedBlock = ({ clientId, triggerAnimationOnChange }) => {
    const ref = useMovingAnimation({
        triggerAnimationOnChange,
        clientId,
    });

    return <div ref={ref}>Animated Block</div>;
};
```

## Parameters

### `triggerAnimationOnChange`
- **Type:** `any`
- **Description:** Changing this value will trigger a new animation.

### `clientId`
- **Type:** `string`
- **Description:** The unique identifier for the block. Used to determine selection and movement behaviors.

## Features
- **Performance Optimizations:** The animation is disabled if the block count exceeds `BLOCK_ANIMATION_THRESHOLD` (200) to prevent lag.
- **User Preferences:** Respects `prefers-reduced-motion` settings for accessibility.
- **Selection Awareness:** Blocks involved in multi-selection are handled properly.
- **Drag Handling:** Prevents animation during block dragging to avoid conflicts.

## Dependencies

- [`react-spring`](https://react-spring.io/): Provides smooth physics-based animations.
- WordPress dependencies:
  - `@wordpress/element`
  - `@wordpress/dom`
  - `@wordpress/data`
  - `@wordpress/block-editor`

## Related Components

This hook is designed for use within the WordPress block editor and should be used under a [`BlockEditorProvider`](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/provider/README.md).

## Notes
- The animation is only applied when necessary to avoid unwanted motion.
- When disabled, the block moves instantly to the new position.
- Adjusts the scroll position to ensure a smooth user experience.

