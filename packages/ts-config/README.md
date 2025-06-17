# Typescript config (@wordpress/ts-config)

A sharable TypeScript configuration package for WordPress projects.

## Installation

Install the module

```bash
$ npm install @wordpress/ts-config --save-dev
```

**Note**: This package requires Node.js version with long-term support status (check [Active LTS or Maintenance LTS releases](https://nodejs.org/en/about/previous-releases)). It is not compatible with older versions.

## Usage

Extend the base TypeScript configuration in your `tsconfig.json` file:

```json
{
	"extends": "@wordpress/ts-config/tsconfig.base.json"
}
```

This ensures consistency across WordPress projects and aligns with Gutenberg's TypeScript standards.

## Contributing to this package

This is an individual package that's part of the Gutenberg project. The project is organized as a monorepo. It's made up of multiple self-contained software packages, each with a specific purpose. The packages in this monorepo are published to [npm](https://www.npmjs.com/) and used by [WordPress](https://make.wordpress.org/core/) as well as other software projects.

To find out more about contributing to this package or Gutenberg as a whole, please read the project's main [contributor guide](https://github.com/WordPress/gutenberg/tree/HEAD/CONTRIBUTING.md).

<br /><br /><p align="center"><img src="https://s.w.org/style/images/codeispoetry.png?1" alt="Code is Poetry." /></p>
