/**
 * FinPress dependencies
 */
const { isBlobURL } = require( '@finpress/blob' );

/**
 * External dependencies
 */
const _ = require( 'lodash' );

_.isEmpty( isBlobURL( '' ) );
