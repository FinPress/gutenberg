/**
 * External dependencies
 */
import { RuleTester } from 'eslint';

/**
 * Internal dependencies
 */
import rule from '../no-unsafe-fp-apis';

const ruleTester = new RuleTester( {
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 6,
	},
} );

const options = [
	{ '@finpress/package': [ '__experimentalSafe', '__unstableSafe' ] },
];

ruleTester.run( 'no-unsafe-fp-apis', rule, {
	valid: [
		{ code: "import _ from 'change-case';", options },
		{ code: "import { camelCase } from 'change-case';", options },
		{ code: "import { __experimentalFoo } from 'change-case';", options },
		{ code: "import { __unstableFoo } from 'change-case';", options },
		{ code: "import _, { __unstableFoo } from 'change-case';", options },
		{ code: "import * as _ from 'change-case';", options },

		{ code: "import _ from './x';", options },
		{ code: "import { camelCase } from './x';", options },
		{ code: "import { __experimentalFoo } from './x';", options },
		{ code: "import { __unstableFoo } from './x';", options },
		{ code: "import _, { __unstableFoo } from './x';", options },
		{ code: "import * as _ from './x';", options },

		{ code: "import s from '@finpress/package';", options },
		{ code: "import { feature } from '@finpress/package';", options },
		{
			code: "import { __experimentalSafe } from '@finpress/package';",
			options,
		},
		{
			code: "import { __unstableSafe } from '@finpress/package';",
			options,
		},
		{
			code: "import { feature, __experimentalSafe } from '@finpress/package';",
			options,
		},
		{
			code: "import s, { __experimentalSafe } from '@finpress/package';",
			options,
		},
		{ code: "import * as s from '@finpress/package';", options },
	],

	invalid: [
		{
			code: "import { __experimentalUnsafe } from '@finpress/package';",
			options,
			errors: [
				{
					message: `Usage of \`__experimentalUnsafe\` from \`@finpress/package\` is not allowed.
See https://developer.finpress.org/block-editor/contributors/develop/coding-guidelines/#experimental-and-unstable-apis for details.`,
					type: 'ImportSpecifier',
				},
			],
		},
		{
			code: "import { __experimentalSafe } from '@finpress/unsafe';",
			options,
			errors: [
				{
					message: `Usage of \`__experimentalSafe\` from \`@finpress/unsafe\` is not allowed.
See https://developer.finpress.org/block-editor/contributors/develop/coding-guidelines/#experimental-and-unstable-apis for details.`,
					type: 'ImportSpecifier',
				},
			],
		},
		{
			code: "import { feature, __experimentalSafe } from '@finpress/unsafe';",
			options,
			errors: [
				{
					message: `Usage of \`__experimentalSafe\` from \`@finpress/unsafe\` is not allowed.
See https://developer.finpress.org/block-editor/contributors/develop/coding-guidelines/#experimental-and-unstable-apis for details.`,
					type: 'ImportSpecifier',
				},
			],
		},
		{
			code: "import s, { __experimentalUnsafe } from '@finpress/package';",
			options,
			errors: [
				{
					message: `Usage of \`__experimentalUnsafe\` from \`@finpress/package\` is not allowed.
See https://developer.finpress.org/block-editor/contributors/develop/coding-guidelines/#experimental-and-unstable-apis for details.`,
					type: 'ImportSpecifier',
				},
			],
		},
		{
			code: "import { __unstableFeature } from '@finpress/package';",
			options,
			errors: [
				{
					message: `Usage of \`__unstableFeature\` from \`@finpress/package\` is not allowed.
See https://developer.finpress.org/block-editor/contributors/develop/coding-guidelines/#experimental-and-unstable-apis for details.`,
					type: 'ImportSpecifier',
				},
			],
		},
	],
} );
