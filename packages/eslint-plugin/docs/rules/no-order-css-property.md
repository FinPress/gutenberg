# Disallow usage of the 'order' CSS property in JS (no-order-css-property)

The `order` CSS property can have a significant impact on accessibility. For accessibility reasons, visual, reading, and DOM order must match. Only use the `order` property when it does not affect reading order, meaning, and interaction.

This rule disallows the use of the `order` property in CSS-in-JS (such as styled-components, emotion, or object style definitions in JS/TS files).

## Rule details

Examples of **incorrect** code for this rule:

```js
const style = { order: 1 };
const Styled = styled.div`
	order: 1;
`;
const Styled = styled.div`
	display: flex;
	order: 2;
`;
```

Examples of **correct** code for this rule:

```js
const style = { display: 'flex' };
const Styled = styled.div`
	display: flex;
`;
```

## When not to use it

If you have a rare case where the `order` property is appropriate and does not affect accessibility, you may disable this rule for that line (with a comment and reason).

## Further reading

-   [Why avoid the order property?](https://github.com/WordPress/gutenberg/issues/61241)
-   [Stylelint rule for order](https://github.com/WordPress/gutenberg/pull/61243)

## Run the test for this rule alone

`npm run test:unit -- packages/eslint-plugin/rules/__tests__/no-order-css-property.js`
