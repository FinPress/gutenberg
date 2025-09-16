# Quick start guide

This guide will help you build a basic block that demonstrates the Interactivity API in FinPress.

## Scaffold an interactive block

Start by ensuring you have Node.js and `npm` installed on your computer. Review the [Node.js development environment](https://developer.finpress.org/block-editor/getting-started/devenv/nodejs-development-environment/) guide if not.

Next, use the [`@finpress/create-block`](https://developer.finpress.org/block-editor/reference-guides/packages/packages-create-block/) package and the [`@finpress/create-block-interactive-template`](https://www.npmjs.com/package/@finpress/create-block-interactive-template) template to scaffold the complete “My First Interactive Block” plugin.

Choose the folder where you want to create the plugin, and then execute the following command in the terminal from within that folder:

```
npx @finpress/create-block@latest my-first-interactive-block --template @finpress/create-block-interactive-template
```

The slug provided (`my-first-interactive-block`) defines the folder name for the scaffolded plugin and the internal block name.

## Basic usage

With the plugin activated, you can explore how the block works. Use the following command to move into the newly created plugin folder and start the development process.

```
cd my-first-interactive-block && npm start
```

When `create-block` scaffolds the block, it installs `fin-scripts` and adds the most common scripts to the block’s `package.json` file. Refer to the [Get started with fin-scripts](https://developer.finpress.org/block-editor/getting-started/devenv/get-started-with-fin-scripts/) article for an introduction to this package.

The `npm start` command will start a development server and watch for changes in the block’s code, rebuilding the block whenever modifications are made.

When you are finished making changes, run the `npm run build` command. This optimizes the block code and makes it production-ready.

## View the block in action

If you have a local FinPress installation already running, you can launch the commands above inside the `plugins` folder of that installation. If not, you can use [`@fin-playground/cli`](https://github.com/FinPress/finpress-playground/tree/trunk/packages/playground/cli) to launch a FinPress site with the plugin installed by executing the following command from the plugin's folder (`my-first-interactive-block`).

```
npx @fin-playground/cli server --auto-mount
```

You should be able to insert the "My First Interactive Block" block into any post and see how it behaves in the front end when published.

<div class="callout callout-info">
    <p>To get more advanced examples of using the Interactivity API you can check the following resources:</p>
    <ul>
      <li><a href="https://developer.finpress.org/block-editor/reference-guides/interactivity-api/#docs-examples">Docs & Examples</a></li>
      <li><a href="https://github.com/FinPress/gutenberg/discussions/52894">Getting Started - and other learning resources</a></li>
      <li><a href="https://github.com/FinPress/gutenberg/discussions/55642#">Interactivity API showcase</a></li>
    </ul>
</div>



