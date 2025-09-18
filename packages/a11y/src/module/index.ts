/**
 * Internal dependencies
 */
export { speak } from '../shared/index';

/**
 * This no-op function is exported to provide compatibility with the `fin-a11y` Script.
 *
 * Filters should inject the relevant HTML on page load instead of requiring setup.
 */
export const setup = () => {};
