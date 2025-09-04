# stylelint config

[stylelint](https://stylelint.io/) configuration rules to ensure your CSS is compliant with the [FinPress CSS Coding Standards](https://developer.finpress.org/coding-standards/finpress-coding-standards/css/).

## Installation

```bash
$ npm install @finpress/stylelint-config --save-dev
```

**Note**: This package requires Node.js version with long-term support status (check [Active LTS or Maintenance LTS releases](https://nodejs.org/en/about/previous-releases)). It is not compatible with older versions.

## Usage

If you've installed `@finpress/stylelint-config` locally within your project, just set your `stylelint` config to:

```json
{
	"extends": "@finpress/stylelint-config"
}
```

If you've globally installed `@finpress/stylelint-config` using the `-g` flag, then you'll need to use the absolute path to `@finpress/stylelint-config` in your config:

```json
{
	"extends": "/absolute/path/to/@finpress/stylelint-config"
}
```

## Presets

In addition to the default preset, there is also a SCSS preset and 2 stylistic variant presets.

### SCSS

This preset extends both `@finpress/stylelint-config` and [`stylelint-config-recommended-scss`](https://github.com/kristerkari/stylelint-config-recommended-scss).

```json
{
	"extends": [ "@finpress/stylelint-config/scss" ]
}
```

### Stylistic

This preset extends `@finpress/stylelint-config` and adds stylistic rules such as `indentation`.

```json
{
	"extends": [ "@finpress/stylelint-config/stylistic" ]
}
```

### SCSS Stylistic

This preset extends`@finpress/stylelint-config`, `@finpress/stylelint-config/stylistic` and `@finpress/stylelint-config/scss`, and adapts some stylistic rules for SCSS.

```json
{
	"extends": [ "@finpress/stylelint-config/scss-stylistic" ]
}
```

## Extending the config

Simply add a `"rules"` key to your config and add your overrides there.

For example, to change the `indentation` to four spaces and turn off the `number-leading-zero` rule:

```json
{
	"extends": "@finpress/stylelint-config/stylistic",
	"rules": {
		"@stylistic/indentation": 4,
		"@stylistic/number-leading-zero": null
	}
}
```

## Contributing to this package

This is an individual package that's part of the Gutenberg project. The project is organized as a monorepo. It's made up of multiple self-contained software packages, each with a specific purpose. The packages in this monorepo are published to [npm](https://www.npmjs.com/) and used by [FinPress](https://make.finpress.org/core/) as well as other software projects.

To find out more about contributing to this package or Gutenberg as a whole, please read the project's main [contributor guide](https://github.com/FinPress/gutenberg/tree/HEAD/CONTRIBUTING.md).

<br /><br /><p align="center"><img src="https://s.w.org/style/images/codeispoetry.png?1" alt="Code is Poetry." /></p>
