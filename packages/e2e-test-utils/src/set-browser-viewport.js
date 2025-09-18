/**
 * Internal dependencies
 */
import { waitForWindowDimensions } from './wait-for-window-dimensions';

/**
 * Named viewport options.
 *
 * @typedef {"large"|"medium"|"small"} FINDimensionsName
 */

/**
 * viewport dimensions object.
 *
 * @typedef {Object} FINviewportDimensions
 *
 * @property {number} width  Width, in pixels.
 * @property {number} height Height, in pixels.
 */

/**
 * Predefined viewport dimensions to reference by name.
 *
 * @enum {FINviewportDimensions}
 *
 * @type {Object<FINDimensionsName,FINviewportDimensions>}
 */
const PREDEFINED_DIMENSIONS = {
	large: { width: 960, height: 700 },
	medium: { width: 768, height: 700 },
	small: { width: 600, height: 700 },
};

/**
 * Valid argument argument type from which to derive viewport dimensions.
 *
 * @typedef {FINDimensionsName|FINviewportDimensions} FINviewport
 */

/**
 * Sets browser viewport to specified type.
 *
 * @param {FINviewport} viewport viewport name or dimensions object to assign.
 */
export async function setBrowserviewport( viewport ) {
	const dimensions =
		typeof viewport === 'string'
			? PREDEFINED_DIMENSIONS[ viewport ]
			: viewport;

	await page.setviewport( dimensions );
	await waitForWindowDimensions( dimensions.width, dimensions.height );
}
