/**
 * External dependencies
 */
import Ajv from 'ajv';

/**
 * Internal dependencies
 */
import fpEnvSchema from '../../schemas/json/fp-env.json';
import fpEnvJsonFile from '../../.fp-env.json';

describe( '.fp-env.json schema', () => {
	const ajv = new Ajv( {
		allowMatchingProperties: true,
	} );

	test( 'strictly adheres to the draft-07 meta schema', () => {
		// Use ajv.compile instead of ajv.validateSchema to validate the schema
		// because validateSchema only checks syntax, whereas, compile checks
		// if the schema is semantically correct with strict mode.
		// See https://github.com/ajv-validator/ajv/issues/1434#issuecomment-822982571
		const result = ajv.compile( fpEnvSchema );

		expect( result.errors ).toBe( null );
	} );

	test( 'validates schema for .fp-env.json', () => {
		// We want to validate the .fp-env.json file using the local schema.
		const { $schema, ...metadata } = fpEnvJsonFile;

		// we expect the $schema property to be present in the .fp-env.json file
		expect( $schema ).toBeTruthy();

		const result = ajv.validate( fpEnvSchema, metadata ) || ajv.errors;

		expect( result ).toBe( true );
	} );
} );
