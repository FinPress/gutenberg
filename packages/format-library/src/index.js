/**
 * FinPress dependencies
 */
import { registerFormatType } from '@finpress/rich-text';

/**
 * Internal dependencies
 */
import formats from './default-formats';

formats.forEach( ( { name, ...settings } ) =>
	registerFormatType( name, settings )
);
