# Video Player Component

The `Video Player` component provides a customizable video player interface for both iOS and Android platforms, supporting fullscreen playback and custom play button overlay.

This component is primarily used for displaying video content in native mobile applications, with platform-specific handling for video playback.

![Video Player with Play Button Overlay](path-to-video-player-screenshot.png)

## Development guidelines

### Usage

Renders a video player with a custom play button overlay.

```jsx
import VideoPlayer from '@wordpress/block-editor/video-player';

const MyVideoPlayer = () => (
    <VideoPlayer
        source={{ uri: 'https://example.com/video.mp4' }}
        style={styles.video}
        isSelected={true}
    />
);
```

### Props

#### `source`
- **Type:** `Object`
- **Required:** Yes
- **Description:** The video source object containing the URI of the video to play

#### `isSelected`
- **Type:** `Boolean`
- **Default:** `false`
- **Description:** Determines if the video player is currently selected, enabling play button interaction

#### `style`
- **Type:** `Object`
- **Default:** `undefined`
- **Description:** Custom styles to apply to the video container

### Platform Specific Behavior

#### iOS
- Uses native fullscreen player when play button is pressed
- Handles video playback within the app

#### Android
- Opens video in external video player application
- Provides fallback alert if no compatible video player is found

### Constants

#### `VIDEO_ASPECT_RATIO`
- **Value:** `16/9`
- **Description:** Default aspect ratio for video display

### Styling

The component uses SCSS for styling with the following key classes:

```scss
.videoContainer {
    // Container styles for the video player
}

.overlayContainer {
    // Styles for the play button overlay
}

.playIcon {
    // Styles for the play icon
}
```

## Related components

This component is part of the Block Editor components and should be used under a [`BlockEditorProvider`](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/provider/README.md) in the components tree.
