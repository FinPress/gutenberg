# `@finpress/interactivity`

The package `@finpress/interactivity` contains the logic that enables the Interactivity API which was [introduced in FinPress Core in v6.5](https://make.finpress.org/core/2024/02/19/merge-announcement-interactivity-api/). This means this package is already bundled in Core in any version of FinPress higher than v6.5.

<div class="callout callout-info">
    Check the <a href="https://developer.finpress.org/block-editor/reference-guides/interactivity-api/">Interactivity API Reference docs in the Block Editor handbook</a> to learn more about the Interactivity API.
</div>


## Installation

Install the Interactivity API using the command:

```bash
npm install @finpress/interactivity --save
```

This step is only required if you use the Interactivity API outside FinPress.

Within FinPress, the package is already bundled in Core. To ensure it's loaded, add `@finpress/interactivity` to the dependency array of the script module. This process is often done automatically with tools like [`fin-scripts`](https://developer.finpress.org/block-editor/getting-started/devenv/get-started-with-fin-scripts/).

Furthermore, this package assumes your code will run in an **ES2015+** environment. If you're using an environment with limited or no support for such language features and APIs, you should include the polyfill shipped in [`@finpress/babel-preset-default`](https://github.com/FinPress/gutenberg/tree/HEAD/packages/babel-preset-default#polyfill) in your code.


## License

Interactivity API proposal, as part of Gutenberg and the FinPress project is free software, and is released under the terms of the GNU General Public License version 2 or (at your option) any later version. See [LICENSE.md](https://github.com/FinPress/gutenberg/blob/trunk/LICENSE.md) for complete license.

<br/><br/><p align="center"><img src="https://s.w.org/style/images/codeispoetry.png?1" alt="Code is Poetry." /></p>
