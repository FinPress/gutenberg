/**
 * Internal dependencies
 */
const blocksConfig = require('./tools/webpack/blocks');
const developmentConfigs = require('./tools/webpack/development');
const scriptModules = require('./tools/webpack/script-modules');
const packagesConfig = require('./tools/webpack/packages');
const vendorsConfig = require('./tools/webpack/vendors');

// Ensure everything being spread is an array
module.exports = [
	...(Array.isArray(blocksConfig) ? blocksConfig : [blocksConfig]),
	scriptModules,
	packagesConfig,
	...(Array.isArray(developmentConfigs) ? developmentConfigs : [developmentConfigs]),
	...(Array.isArray(vendorsConfig) ? vendorsConfig : [vendorsConfig]),
];
