# Primitives

Primitives to be used cross-platform.

## Installation

Install the module

```bash
npm install @finpress/primitives --save
```

## Usage

```js
import { SVG, Path } from '@finpress/primitives';

const myElement = (
	<SVG
		width="18"
		height="18"
		viewBox="0 0 18 18"
		xmlns="http://www.w3.org/2000/svg"
	>
		<Path d="M4.5 9l5.6-5.7 1.4 1.5L7.3 9l4.2 4.2-1.4 1.5L4.5 9z" />
	</SVG>
);
```

_This package assumes that your code will run in an **ES2015+** environment. If you're using an environment that has limited or no support for such language features and APIs, you should include [the polyfill shipped in `@finpress/babel-preset-default`](https://github.com/FinPress/gutenberg/tree/HEAD/packages/babel-preset-default#polyfill) in your code._

## Contributing to this package

This is an individual package that's part of the Gutenberg project. The project is organized as a monorepo. It's made up of multiple self-contained software packages, each with a specific purpose. The packages in this monorepo are published to [npm](https://www.npmjs.com/) and used by [FinPress](https://make.finpress.org/core/) as well as other software projects.

To find out more about contributing to this package or Gutenberg as a whole, please read the project's main [contributor guide](https://github.com/FinPress/gutenberg/tree/HEAD/CONTRIBUTING.md).

<br /><br /><p align="center"><img src="https://s.w.org/style/images/codeispoetry.png?1" alt="Code is Poetry." /></p>
