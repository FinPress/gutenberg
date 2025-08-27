### Audio Player Component

The `audio-player` component is a React Native component used within the WordPress Gutenberg mobile editor. It provides an interface for embedding and playing audio files.

---

#### Installation
This component is part of the WordPress Gutenberg repository and does not require separate installation. Ensure your project is set up with Gutenberg mobile dependencies.

---

#### Usage

```jsx
import AudioPlayer from './path/to/audio-player';

<AudioPlayer
    isUploadInProgress={false}
    isUploadFailed={false}
    attributes={{ id: 1, src: 'https://example.com/audio.mp3' }}
    isSelected={true}
/>
```

---

#### Props

| Prop                | Type     | Description |
|---------------------|----------|-------------|
| `isUploadInProgress` | `boolean` | Indicates whether an audio file is currently being uploaded. |
| `isUploadFailed` | `boolean` | Indicates whether the audio file upload has failed. |
| `attributes` | `object` | Contains audio metadata including `id` and `src` URL of the file. |
| `isSelected` | `boolean` | Indicates whether the component is selected in the editor. |

---

#### Features
- Supports opening audio files via linking (`Linking.openURL`).
- Displays upload progress and failure states.
- Provides an option to cancel or retry failed uploads.
- Uses `react-native-video` for playback support on iOS.
- Handles UI appearance according to the current editor color scheme.

---

#### Platform Considerations
- On **iOS**, the component uses `react-native-video` for playback.
- On **Android**, audio files are opened via the default audio player application.

---

#### Related Components
- `Icon` from `@wordpress/components` for displaying audio icons.
- `useEditorColorScheme` from `../global-styles/use-global-styles-context` for adaptive theming.
- `requestImageFailedRetryDialog` and `requestImageUploadCancelDialog` from `@wordpress/react-native-bridge` for handling upload dialogs.


