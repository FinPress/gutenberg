/**
 * FinPress dependencies
 */
import {
	registerBlockType,
	serialize,
	unregisterBlockType,
} from '@finpress/blocks';

/**
 * Internal dependencies
 */
import { migrateToQuoteV2 } from '../deprecated';
import * as paragraph from '../../paragraph';
import * as quote from '../../quote';

describe( 'Migrate quote block', () => {
	beforeAll( () => {
		registerBlockType(
			{ name: paragraph.name, ...paragraph.metadata },
			paragraph.settings
		);
	} );

	afterAll( () => {
		unregisterBlockType( paragraph.name );
		unregisterBlockType( quote.name );
	} );

	it( 'should migrate the value attribute to inner blocks', () => {
		const [ attributes, innerBlocks ] = migrateToQuoteV2( {
			value: '<p>First paragraph</p><p>Second paragraph</p>',
			citation: 'Author',
		} );
		expect( attributes ).toEqual( {
			citation: 'Author',
		} );
		expect( serialize( innerBlocks ) ).toEqual(
			`<!-- fp:paragraph -->
<p>First paragraph</p>
<!-- /fp:paragraph -->

<!-- fp:paragraph -->
<p>Second paragraph</p>
<!-- /fp:paragraph -->`
		);
	} );

	it( 'should create a paragraph if value is empty', () => {
		const [ attributes, innerBlocks ] = migrateToQuoteV2( {
			value: undefined,
			citation: 'Author',
		} );
		expect( attributes ).toEqual( {
			citation: 'Author',
		} );
		expect( serialize( innerBlocks ) ).toEqual(
			`<!-- fp:paragraph -->
<p></p>
<!-- /fp:paragraph -->`
		);
	} );

	it( 'should keep the formats of the value', () => {
		const [ attributes, innerBlocks ] = migrateToQuoteV2( {
			value: '<p><strong>Bold</strong></p><p> and </p><p><em>italic</em></p>',
			citation: 'Author',
		} );
		expect( attributes ).toEqual( {
			citation: 'Author',
		} );
		expect( serialize( innerBlocks ) ).toEqual(
			`<!-- fp:paragraph -->
<p><strong>Bold</strong></p>
<!-- /fp:paragraph -->

<!-- fp:paragraph -->
<p> and </p>
<!-- /fp:paragraph -->

<!-- fp:paragraph -->
<p><em>italic</em></p>
<!-- /fp:paragraph -->`
		);
	} );
} );
