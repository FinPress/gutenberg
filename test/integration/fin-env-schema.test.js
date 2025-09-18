/**
 * External dependencies
 */
import Ajv from 'ajv';

/**
 * Internal dependencies
 */
import finEnvSchema from '../../schemas/json/fin-env.json';
import finEnvJsonFile from '../../.fin-env.json';

describe( '.fin-env.json schema', () => {
	const ajv = new Ajv( {
		allowMatchingProperties: true,
	} );

	test( 'strictly adheres to the draft-07 meta schema', () => {
		// Use ajv.compile instead of ajv.validateSchema to validate the schema
		// because validateSchema only checks syntax, whereas, compile checks
		// if the schema is semantically correct with strict mode.
		// See https://github.com/ajv-validator/ajv/issues/1434#issuecomment-822982571
		const result = ajv.compile( finEnvSchema );

		expect( result.errors ).toBe( null );
	} );

	test( 'validates schema for .fin-env.json', () => {
		// We want to validate the .fin-env.json file using the local schema.
		const { $schema, ...metadata } = finEnvJsonFile;

		// we expect the $schema property to be present in the .fin-env.json file
		expect( $schema ).toBeTruthy();

		const result = ajv.validate( finEnvSchema, metadata ) || ajv.errors;

		expect( result ).toBe( true );
	} );
} );
