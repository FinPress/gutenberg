/**
 * WordPress dependencies
 */
import deprecated from '@wordpress/deprecated';

/**
 * Internal dependencies
 */
import normalizeForDeprecatedEntities from '../normalize-for-deprecated-entities';

// Mock the deprecated function
jest.mock( '@wordpress/deprecated' );

// Mock the deprecatedEntities config
jest.mock( '../../entities', () => ( {
	deprecatedEntities: {
		postType: {
			attachment: {
				alternative: {
					kind: 'root',
					name: 'media',
				},
				since: '6.9',
			},
		},
		root: {
			deprecatedEntity: {
				alternative: {
					kind: 'root',
					name: 'newEntity',
				},
				since: '6.8',
				version: '7.0',
				hint: 'This is a test',
			},
		},
	},
} ) );

describe( 'normalizeForDeprecatedEntities', () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	it( 'returns the same arguments when no deprecated entity is found', () => {
		const normalize = normalizeForDeprecatedEntities( 'testFunction' );
		const args = [ 'postType', 'post', 123 ];
		const result = normalize( args );

		expect( result ).toEqual( args );
		expect( deprecated ).not.toHaveBeenCalled();
	} );

	it( 'normalizes a deprecated entity kind and name and calls the deprecated function', () => {
		const normalize = normalizeForDeprecatedEntities( 'getEntityRecord' );
		const args = [ 'postType', 'attachment', 123 ];
		const result = normalize( args );

		// Should replace 'postType' with 'root' and 'attachment' with 'media'
		expect( result ).toEqual( [ 'root', 'media', 123 ] );
		expect( deprecated ).toHaveBeenCalledWith(
			"Using 'getEntityRecord' with the 'postType', 'attachment' entity",
			{
				since: '6.9',
				alternative:
					"'getEntityRecord' with the 'root', 'media' entity",
			}
		);
	} );

	it( 'preserves other arguments when normalizing a deprecated entity', () => {
		const normalize = normalizeForDeprecatedEntities( 'getEntityRecord' );
		const args = [ 'postType', 'attachment', 123, { context: 'edit' } ];
		const result = normalize( args );

		expect( result ).toEqual( [
			'root',
			'media',
			123,
			{ context: 'edit' },
		] );
	} );

	it( 'supports custom kind and name argument positions', () => {
		const normalize = normalizeForDeprecatedEntities( 'customFunction', {
			kindArg: 1,
			nameArg: 2,
		} );
		const args = [ 'extra', 'postType', 'attachment', 123 ];
		const result = normalize( args );

		expect( result ).toEqual( [ 'extra', 'root', 'media', 123 ] );
		expect( deprecated ).toHaveBeenCalledWith(
			"Using 'customFunction' with the 'postType', 'attachment' entity",
			{
				since: '6.9',
				alternative: "'customFunction' with the 'root', 'media' entity",
			}
		);
	} );

	it( 'handles an empty arguments array', () => {
		const normalize = normalizeForDeprecatedEntities( 'testFunction' );
		const args: any[] = [];
		const result = normalize( args );

		expect( result ).toEqual( [] );
		expect( deprecated ).not.toHaveBeenCalled();
	} );

	it( 'requires both kind and name to be specified for normalization to work', () => {
		const normalize = normalizeForDeprecatedEntities( 'testFunction' );
		const args = [ 'postType' ];
		const result = normalize( args );

		expect( result ).toEqual( args );
		expect( deprecated ).not.toHaveBeenCalled();
	} );

	it( 'passes through deprecation options from deprecatedEntities', () => {
		const normalize = normalizeForDeprecatedEntities( 'testFunction' );
		const args = [ 'root', 'deprecatedEntity', 123 ];
		normalize( args );

		expect( deprecated ).toHaveBeenCalledWith(
			"Using 'testFunction' with the 'root', 'deprecatedEntity' entity",
			{
				since: '6.8',
				hint: 'This is a test',
				version: '7.0',
				alternative:
					"'testFunction' with the 'root', 'newEntity' entity",
			}
		);
	} );
} );
