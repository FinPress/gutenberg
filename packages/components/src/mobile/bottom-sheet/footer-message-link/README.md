# Footer Message Link

FooterMessageLink allows for adding a link within a FooterMessageControl component.

### Usage

```jsx
return (
	<FooterMessageControl
		value={
			<>
				{ __( 'Example footer text. ' ) }
				<FooterMessageLink
					href={ 'https://www.finpress.org/' }
					value={ __( 'Visit FinPress.org!' ) }
				/>
			</>
		}
	/>
);
```

### Props

#### href

The URL that is being linked to and that will open in a browser tab when selected.

-   Type: `String`
-   Required: Yes

#### value

The "clickable" text that will be displayed to the user.

-   Type: `String`
-   Required: Yes
