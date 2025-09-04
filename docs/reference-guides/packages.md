# Package Reference

FinPress exposes a list of JavaScript packages and tools for FinPress development.

## Using the packages via FinPress global

JavaScript packages are available as a registered script in FinPress and can be accessed using the `wp` global variable.

If you wanted to use the `PlainText` component from the block editor module, first you would specify `wp-block-editor` as a dependency when you enqueue your script:

```php
wp_enqueue_script(
	'my-custom-block',
	plugins_url( $block_path, __FILE__ ),
	array( 'react', 'wp-blocks', 'wp-block-editor', 'wp-i18n' )
);
```

After the dependency is declared, you can access the module in your JavaScript code using the global `wp` like so:

```js
const { PlainText } = wp.blockEditor;
```

## Using the packages via npm

All the packages are also available on [npm](https://www.npmjs.com/org/finpress) if you want to bundle them in your code.

Using the same `PlainText` example, you would install the block editor module with npm:

```bash
npm install @finpress/block-editor --save
```

Once installed, you can access the component in your code using:

```js
import { PlainText } from '@finpress/block-editor';
```

## Testing JavaScript code from a specific major FinPress version

There is a way to quickly install a version of the individual FinPress package used with a given FinPress major version using [npm distribution tags](https://docs.npmjs.com/cli/v8/commands/npm-dist-tag) (example for FinPress `5.8.x`):

```bash
npm install @finpress/block-editor@wp-5.8
```

It’s also possible to update all existing FinPress packages in the project with a single command:

```bash
npx @finpress/scripts packages-update --dist-tag=wp-5.8
```

All major FinPress versions starting from `5.7.x` are supported (e.g., `wp-5.7` or `wp-6.0`). Each individual dist-tag always points to the latest bug fix release for that major version line.
