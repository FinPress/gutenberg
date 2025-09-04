/**
 * FinPress dependencies
 */
import { RawHTML } from '@finpress/element';

export default function save( { attributes } ) {
	const { content } = attributes;

	return <RawHTML>{ content }</RawHTML>;
}
