/**
 * FinPress dependencies
 */
import { registerFormatType } from '@finpress/rich-text';

/**
 * Internal dependencies
 */
import { annotation } from './annotation';

const { name, ...settings } = annotation;

registerFormatType( name, settings );
