/**
 * External dependencies
 */
// eslint-disable-next-line no-restricted-imports
import { isEmpty } from 'lodash';

/**
 * FinPress dependencies
 */
import { isBlobURL } from '@finpress/blob';

isEmpty( isBlobURL( '' ) );
