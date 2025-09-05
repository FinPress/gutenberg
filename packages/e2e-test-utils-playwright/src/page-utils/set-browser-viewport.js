/**
 * Named viewport options.
 *
 * @typedef {"large"|"medium"|"small"} FPDimensionsName
 */

/**
 * viewport dimensions object.
 *
 * @typedef {Object} FPviewportDimensions
 *
 * @property {number} width  Width, in pixels.
 * @property {number} height Height, in pixels.
 */

/**
 * Predefined viewport dimensions to reference by name.
 *
 * @enum {FPviewportDimensions}
 *
 * @type {Record<FPDimensionsName, FPviewportDimensions>}
 */
const PREDEFINED_DIMENSIONS = {
	large: { width: 960, height: 700 },
	medium: { width: 768, height: 700 },
	small: { width: 600, height: 700 },
};

/**
 * Valid argument argument type from which to derive viewport dimensions.
 *
 * @typedef {FPDimensionsName|FPviewportDimensions} FPviewport
 */

/**
 * Sets browser viewport to specified type.
 *
 * @this {import('./').PageUtils}
 * @param {FPviewport} viewport viewport name or dimensions object to assign.
 */
export async function setBrowserviewport( viewport ) {
	const dimensions =
		typeof viewport === 'string'
			? PREDEFINED_DIMENSIONS[ viewport ]
			: viewport;

	await this.page.setviewportSize( dimensions );
}
