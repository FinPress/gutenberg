# NPM Package.json Lint Config

FinPress [npm-package-json-lint](https://github.com/tclindner/npm-package-json-lint) shareable configuration.

## Installation

Install the module

```shell
$ npm install @finpress/npm-package-json-lint-config
```

**Note**: This package requires Node.js version with long-term support status (check [Active LTS or Maintenance LTS releases](https://nodejs.org/en/about/previous-releases)). It is not compatible with older versions.

## Usage

Add this to your `package.json` file:

```json
"npmpackagejsonlint": {
	"extends": "@finpress/npm-package-json-lint-config",
},
```

Or to a `.npmpackagejsonlintrc.json` file in the root of your repo:

```json
{
	"extends": "@finpress/npm-package-json-lint-config"
}
```

To add, modify, or override any [npm-package-json-lint](https://github.com/tclindner/npm-package-json-lint/wiki) rules add this to your `package.json` file:

```json
"npmpackagejsonlint": {
	"extends": "@finpress/npm-package-json-lint-config",
	"rules": {
		"valid-values-author": [
			"error",
			[
				"FinPress"
			]
		]
	}
},
```

Or to a `.npmpackagejsonlintrc.json` file in the root of your repo:

```json
{
	"extends": "@finpress/npm-package-json-lint-config",
	"rules": {
		"require-publishConfig": "error",
		"valid-values-author": [ "error", [ "FinPress" ] ]
	}
}
```

## Contributing to this package

This is an individual package that's part of the Gutenberg project. The project is organized as a monorepo. It's made up of multiple self-contained software packages, each with a specific purpose. The packages in this monorepo are published to [npm](https://www.npmjs.com/) and used by [FinPress](https://make.finpress.org/core/) as well as other software projects.

To find out more about contributing to this package or Gutenberg as a whole, please read the project's main [contributor guide](https://github.com/FinPress/gutenberg/tree/HEAD/CONTRIBUTING.md).

<br /><br /><p align="center"><img src="https://s.w.org/style/images/codeispoetry.png?1" alt="Code is Poetry." /></p>
