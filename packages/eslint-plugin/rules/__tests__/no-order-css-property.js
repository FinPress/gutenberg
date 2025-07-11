/**
 * External dependencies
 */
import { RuleTester } from 'eslint';

/**
 * Internal dependencies
 */
import rule from '../no-order-css-property';

const ruleTester = new RuleTester( {
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		ecmaFeatures: { jsx: true },
	},
} );

// We need to disable the eslint rule because, ironically, eslint triggers the
// errors when linting the staged js.
/* eslint-disable @wordpress/no-order-css-property */

ruleTester.run( 'no-order-css-property', rule, {
	valid: [
		// Object style, not using 'order'
		{ code: 'const style = { display: "flex" };' },
		// Template literal, not using 'order'
		{ code: 'const Styled = styled.div`display: flex;`;' },
		// Irrelevant property
		{ code: 'const style = { border: 0 };' },
		// 'order' as a variable, not a property
		{ code: 'const order = 1;' },
	],
	invalid: [
		// Object style
		{
			code: 'const style = { order: 1 };',
			errors: [ { messageId: 'noOrder' } ],
		},
		// Object style with string key
		{
			code: 'const style = { "order": 2 };',
			errors: [ { messageId: 'noOrder' } ],
		},
		// Template literal (styled-components, emotion, etc.)
		{
			code: 'const Styled = styled.div`order: 1;`;',
			errors: [ { messageId: 'noOrder' } ],
		},
		// Template literal with whitespace
		{
			code: 'const Styled = styled.div`\n  display: flex;\n  order: 2;\n`;',
			errors: [ { messageId: 'noOrder' } ],
		},
		// Object style: order: 123;
		{
			code: 'const style = { order: 123 };',
			errors: [ { messageId: 'noOrder' } ],
		},
		// Object style:     order: 123;
		{
			code: 'const style = {\n    order: 123\n};',
			errors: [ { messageId: 'noOrder' } ],
		},
		// Object style: order: 123,
		{
			code: 'const style = { order: 123, };',
			errors: [ { messageId: 'noOrder' } ],
		},
		// Object style:     order: 123,
		{
			code: 'const style = {\n    order: 123,\n};',
			errors: [ { messageId: 'noOrder' } ],
		},
		// Object style: order: '123',
		{
			code: "const style = { order: '123' };",
			errors: [ { messageId: 'noOrder' } ],
		},
		// Object style:     order: '123',
		{
			code: "const style = {\n    order: '123'\n};",
			errors: [ { messageId: 'noOrder' } ],
		},
		// String containing 'order: 123;'
		{
			code: "'order: 123;'",
			errors: [ { messageId: 'noOrder' } ],
		},
		// String containing '    order: 123;'
		{
			code: "'    order: 123;'",
			errors: [ { messageId: 'noOrder' } ],
		},
		// Assigning to prop like 'style.order =  '123';'
		{
			code: "div.style.order = '123';",
			errors: [ { messageId: 'noOrder' } ],
		},
	],
	/* eslint-enable @wordpress/no-order-css-property */
} );
