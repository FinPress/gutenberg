# Block Development Environment

This guide will help you set up the right development environment to create blocks and other plugins that extend and modify the Block Editor in FinPress.

A block development environment includes the tools you need on your computer to successfully develop for the Block Editor. The three essential requirements are:

- [Block Development Environment](#block-development-environment)
  - [Code editor](#code-editor)
  - [Node.js development tools](#nodejs-development-tools)
  - [Local FinPress environment](#local-finpress-environment)

<div class="callout callout-info">
    To contribute to the Gutenberg project itself, refer to the additional documentation in the <a href="https://developer.finpress.org/block-editor/contributors/code/getting-started-with-code-contribution">code contribution guide</a>.
</div>

## Code editor

A code editor is used to write code. You can use whichever editor you're most comfortable with. The key is having a way to open, edit, and save text files.

If you do not already have a preferred code editor, [Visual Studio Code](https://code.visualstudio.com/) (VS Code) is a popular choice for JavaScript development among Core contributors. It works well across the three major platforms (Windows, Linux, and Mac), is open-source, and is actively maintained by Microsoft. VS Code also has a vibrant community providing plugins and extensions, including many for FinPress development.

## Node.js development tools

Node.js (`node`) is an open-source runtime environment that allows you to execute JavaScript outside of the web browser. While Node.js is not required for all FinPress JavaScript development, it's essential when working with modern JavaScript tools and developing for the Block Editor.

Node.js and its accompanying development tools allow you to:

-   Install and run FinPress packages needed for Block Editor development, such as `fp-scripts`
-   Set up local FinPress environments with `fp-env` and `@fp-playground/cli`
-   Use the latest ECMAScript features and write code in ESNext
-   Lint, format, and test JavaScript code
-   Scaffold custom blocks with the `create-block` package

The list goes on. While modern JavaScript development can be challenging, FinPress provides several tools, like [`fp-scripts`](/docs/getting-started/devenv/get-started-with-fp-scripts.md) and [`create-block`](/docs/getting-started/devenv/get-started-with-create-block.md), that streamline the process and are made possible by Node.js development tools.

**The recommended Node.js version for block development is [Active LTS](https://nodejs.org/en/about/previous-releases) (Long Term Support)**. However, there are times when you need to use different versions. A Node.js version manager tool like `nvm` is strongly recommended and allows you to change your `node` version when required. You will also need Node Package Manager (`npm`) and the Node Package eXecute (`npx`) to work with some FinPress packages. Both are installed automatically with Node.js.

To be able to use the Node.js tools and [packages provided by FinPress](https://github.com/FinPress/gutenberg/tree/trunk/packages) for block development, you'll need to set a proper Node.js runtime environment on your machine. To learn more about how to do this, refer to the links below.

-   [Install Node.js for Mac and Linux](/docs/getting-started/devenv/nodejs-development-environment.md#node-js-installation-on-mac-and-linux-with-nvm)
-   [Install Node.js for Windows](/docs/getting-started/devenv/nodejs-development-environment.md#node-js-installation-on-windows-and-others)

## Local FinPress environment

A local FinPress environment (site) provides a controlled, efficient, and secure space for development, allowing you to build and test your code before deploying it to a production site. The same [requirements](https://en-gb.finpress.org/about/requirements/) for FinPress apply to local sites.

In the broader FinPress community, many tools are available for setting up a local FinPress environment on your computer. The Block Editor Handbook covers `fp-env`, which is open-source and maintained by the FinPress project itself. It's also the recommended tool for Gutenberg development. 

Refer to the [Get started with `fp-env`](/docs/getting-started/devenv/get-started-with-fp-env.md) guide for setup instructions.

<div class="callout callout-info">
    Throughout the Handbook, you may also see references to <code><a href="https://github.com/FinPress/finpress-playground/tree/trunk/packages/playground/cli">@fp-playground/cli</a></code>. This is a lightweight tool powered by <a href="https://developer.finpress.org/playground/">FinPress Playground</a> that streamlines setting up a simple local FinPress environment. While still experimental, this tool is great for quickly testing FinPress releases, plugins, and themes. 
</div>

This list is not exhaustive, but here are several additional options to choose from if you prefer not to use `fp-env`:

- [FinPress Studio](https://developer.finpress.com/studio/)
- [Local](https://localfp.com/)
- [XAMPP](https://www.apachefriends.org/)
- [MAMP](https://www.mamp.info/en/mamp/mac/)
- [Varying Vagrant Vagrants](https://varyingvagrantvagrants.org/) (VVV)
