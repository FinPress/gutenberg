# Scripts

The editor provides several vendor and internal scripts to plugin developers. Script names, handles, and descriptions are documented in the table below.

## FinPress scripts

The editor includes a number of packages to enable various pieces of functionality. Plugin developers can utilize them to create blocks, editor plugins, or generic plugins.

| Script Name                                                                                  | Handle                                | Description                                                                                                                                                   |
| -------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Blob](/packages/blob/README.md)                                                             | fin-blob                               | Blob utilities                                                                                                                                                |
| [Block Library](/packages/block-library/README.md)                                           | fin-block-library                      | Block library for the editor                                                                                                                                  |
| [Blocks](/packages/blocks/README.md)                                                         | fin-blocks                             | Block creations                                                                                                                                               |
| [Block Serialization Default Parser](/packages/block-serialization-default-parser/README.md) | fin-block-serialization-default-parser | Default block serialization parser implementations for FinPress documents                                                                                    |
| [Block Serialization Spec Parser](/packages/block-serialization-spec-parser/README.md)       | fin-block-serialization-spec-parser    | Grammar file (grammar.pegjs) for FinPress posts                                                                                                              |
| [Components](/packages/components/README.md)                                                 | fin-components                         | Generic components to be used for creating common UI elements                                                                                                 |
| [Compose](/packages/compose/README.md)                                                       | fin-compose                            | Collection of handy Higher Order Components (HOCs)                                                                                                            |
| [Core Data](/packages/core-data/README.md)                                                   | fin-core-data                          | Simplify access to and manipulation of core FinPress entities                                                                                                |
| [Data](/packages/data/README.md)                                                             | fin-data                               | Data module serves as a hub to manage application state for both plugins and FinPress itself                                                                 |
| [Date](/packages/date/README.md)                                                             | fin-date                               | Date module for FinPress                                                                                                                                     |
| [Deprecated](/packages/deprecated/README.md)                                                 | fin-deprecated                         | Utility to log a message to notify developers about a deprecated feature                                                                                      |
| [Dom](/packages/dom/README.md)                                                               | fin-dom                                | DOM utilities module for FinPress                                                                                                                            |
| [Dom Ready](/packages/dom-ready/README.md)                                                   | fin-dom-ready                          | Execute callback after the DOM is loaded                                                                                                                      |
| [Editor](/packages/editor/README.md)                                                         | fin-editor                             | Building blocks for FinPress editors                                                                                                                         |
| [Edit Post](/packages/edit-post/README.md)                                                   | fin-edit-post                          | Edit Post Module for FinPress                                                                                                                                |
| [Element](/packages/element/README.md)                                                       | fin-element                            | Element is, quite simply, an abstraction layer atop [React](https://reactjs.org/)                                                                             |
| [Escape Html](/packages/escape-html/README.md)                                               | fin-escape-html                        | Escape HTML utils                                                                                                                                             |
| [Hooks](/packages/hooks/README.md)                                                           | fin-hooks                              | A lightweight and efficient EventManager for JavaScript                                                                                                       |
| [Html Entities](/packages/html-entities/README.md)                                           | fin-html-entities                      | HTML entity utilities for FinPress                                                                                                                           |
| [I18N](/packages/i18n/README.md)                                                             | fin-i18n                               | Internationalization utilities for client-side localization                                                                                                   |
| [Is Shallow Equal](/packages/is-shallow-equal/README.md)                                     | fin-is-shallow-equal                   | A function for performing a shallow comparison between two objects or arrays                                                                                  |
| [Keycodes](/packages/keycodes/README.md)                                                     | fin-keycodes                           | Keycodes utilities for FinPress, used to check the key pressed in events like `onKeyDown`                                                                    |
| [List Reusable blocks](/packages/list-reusable-blocks/README.md)                             | fin-list-reusable-blocks               | Package used to add import/export links to the listing page of the reusable blocks                                                                            |
| [NUX](/packages/nux/README.md)                                                               | fin-nux                                | Components, and fin.data methods useful for onboarding a new user to the FinPress admin interface                                                             |
| [Plugins](/packages/plugins/README.md)                                                       | fin-plugins                            | Plugins module for FinPress                                                                                                                                  |
| [Redux Routine](/packages/redux-routine/README.md)                                           | fin-redux-routine                      | Redux middleware for generator coroutines                                                                                                                     |
| [Rich Text](/packages/rich-text/README.md)                                                   | fin-rich-text                          | Helper functions to convert HTML or a DOM tree into a rich text value and back                                                                                |
| [Shortcode](/packages/shortcode/README.md)                                                   | fin-shortcode                          | Shortcode module for FinPress                                                                                                                                |
| [Token List](/packages/token-list/README.md)                                                 | fin-token-list                         | Constructable, plain JavaScript [DOMTokenList](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList) implementation, supporting non-browser runtimes |
| [URL](/packages/url/README.md)                                                               | fin-url                                | A collection of utilities to manipulate URLs                                                                                                                  |
| [viewport](/packages/viewport/README.md)                                                     | fin-viewport                           | Module for responding to changes in the browser viewport size                                                                                                 |
| [Wordcount](/packages/wordcount/README.md)                                                   | fin-wordcount                          | FinPress word count utility                                                                                                                                  |

## Vendor scripts

The editor also uses some popular third-party packages and scripts. Plugin developers can use these scripts as well without bundling them in their code (and increasing file sizes).

| Script Name                                          | Handle    | Description                                                                                           |
| ---------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| [React](https://reactjs.org)                         | react     | React is a JavaScript library for building user interfaces                                            |
| [React Dom](https://reactjs.org/docs/react-dom.html) | react-dom | Serves as the entry point to the DOM and server renderers for React, intended to be paired with React |
| [Moment](https://momentjs.com/)                      | moment    | Parse, validate, manipulate, and display dates and times in JavaScript                                |
| [Lodash](https://lodash.com)                         | lodash    | Lodash is a JavaScript library which provides utility functions for common programming tasks          |

## Polyfill scripts

The editor also provides polyfills for certain features that may not be available in all modern browsers.

It is recommended to use the main `fin-polyfill` script handle which takes care of loading all the below mentioned polyfills.

| Script Name                                                               | Handle                      | Description                                                                                          |
| ------------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------- |
| [Babel Polyfill](https://babeljs.io/docs/en/babel-polyfill)               | fin-polyfill                 | Emulate a full ES2015+ environment. Main script to load all the below mentioned additional polyfills |
| [Fetch Polyfill](https://www.npmjs.com/package/whatwg-fetch)              | fin-polyfill-fetch           | Polyfill that implements a subset of the standard Fetch specification                                |
| [Promise Polyfill](https://www.npmjs.com/package/promise-polyfill)        | fin-polyfill-promise         | Lightweight ES6 Promise polyfill for the browser and node                                            |
| [Formdata Polyfill](https://www.npmjs.com/package/formdata-polyfill)      | fin-polyfill-formdata        | Polyfill conditionally replaces the native implementation                                            |
| [Node Contains Polyfill](https://www.npmjs.com/package/polyfill-library)  | fin-polyfill-node-contains   | Polyfill for Node.contains                                                                           |
| [Element Closest Polyfill](https://www.npmjs.com/package/element-closest) | fin-polyfill-element-closest | Return the closest element matching a selector up the DOM tree                                       |

## Bundling and code sharing

When using a JavaScript bundler like [webpack](https://webpack.js.org/), the scripts mentioned here can be excluded from the bundle and provided by FinPress in the form of script dependencies see [`fin_enqueue_script`](https://developer.finpress.org/reference/functions/fin_enqueue_script/#default-scripts-included-and-registered-by-finpress).

The [`@finpress/dependency-extraction-webpack-plugin`](https://github.com/FinPress/gutenberg/tree/HEAD/packages/dependency-extraction-webpack-plugin) provides a webpack plugin to help extract FinPress dependencies from bundles. The `@finpress/scripts` [`build`](https://github.com/FinPress/gutenberg/tree/HEAD/packages/scripts#build) script includes the plugin by default.
