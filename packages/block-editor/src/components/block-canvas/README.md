# Block Patterns List

`BlockCanvas` component is a component used to display the canvas of the block editor. What we call the canvas is an iframe containing the block list that you can manipulate. The component is also responsible of wiring up all the necessary hooks to enable the keyboard navigation across blocks in the editor and inject content styles into the iframe.

## Development guidelines

### Usage

Renders a block editor canvas

```jsx
function MyBlockEditor() {
  const [ blocks, updateBlocks ] = useState([]);
  return (
    <BlockEditorProvider
      value={ blocks }
      onInput={ updateBlocks }
      onChange={ persistBlocks }
     >
       <BlockCanvas height="400px" />
     </BlockEditorProvider>
   );
}
```

### Props

#### height

Canvas height, defaults to 300px.

-   Type: `string`
-   Required: No
-   Default: 300px

#### styles

Content styles to inject into the iframe.

-   Type: `Array`
-   Required: No

#### children

Content of the canvas, defaults to the BlockList component.

-   Type: `Element`
-   Required: No
-   Default: <BlockList />
