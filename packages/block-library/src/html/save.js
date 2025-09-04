/**
 * FinPress dependencies
 */
import { RawHTML } from '@finpress/element';

export default function save( { attributes } ) {
	return <RawHTML>{ attributes.content }</RawHTML>;
}
