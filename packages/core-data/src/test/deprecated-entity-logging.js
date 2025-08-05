/**
 * WordPress dependencies
 */
import deprecated from '@wordpress/deprecated';
import { createRegistry } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { store as coreDataStore } from '../index';

jest.mock( '@wordpress/deprecated' );

// Use fake timers within this file.
// logEntityDeprecation() uses setTimeout() to avoid spurious logging, so fake timers are used to
// ensure that the deprecation warning is logged correctly.
jest.useFakeTimers();

/**
 * Returns the expected arguments for the deprecated function call.
 *
 * @param {string}  name                - The name of the function.
 * @param {Array}   args                - The arguments for the function.
 * @param {boolean} isShorthandSelector - Whether the function is a shorthand selector.
 * @param {string}  alternativeFunction - The name of the alternative function.
 * @return {Array} The expected arguments for the deprecated function call.
 */
function getExpectedDeprecationArgs(
	name,
	args,
	isShorthandSelector,
	alternativeFunction
) {
	const expectedMessage = isShorthandSelector
		? `'${ name }'`
		: `The 'root', 'media' entity (used via '${ name }')`;

	let expectedAlternative = "the 'postType', 'attachment' entity";
	if ( alternativeFunction ) {
		expectedAlternative += ` via the '${ alternativeFunction }' function`;
	}

	return [
		expectedMessage,
		{
			alternative: expectedAlternative,
			since: '6.9',
		},
	];
}

/**
 * Creates a test registry with the core-data store and sets up the deprecated media entity.
 *
 * This approach enables testing generated selections/actions (like `getMedia`), and simplifies
 * the tests by avoiding an endless amount of mocks.
 *
 * It means the tests in this file are integration rather than unit tests, so they're kept
 * separate from the selector.js/reducer.js tests.
 *
 * @return {Object} Registry with core-data store registered.
 */
function createTestRegistry() {
	const registry = createRegistry();

	// Register the core-data store
	registry.register( coreDataStore );

	// Set up the deprecated media entity configuration
	const mediaEntityConfig = {
		name: 'media',
		kind: 'root',
		baseURL: '/wp/v2/media',
		baseURLParams: { context: 'edit' },
		plural: 'mediaItems',
		label: 'Media',
		rawAttributes: [ 'caption', 'title', 'description' ],
		supportsPagination: true,
	};

	// Add the media entity to the store
	registry.dispatch( coreDataStore ).addEntities( [ mediaEntityConfig ] );

	// Add a sample media record to the store for testing
	const mediaRecord = {
		id: '123',
		title: 'Test Media',
		content: 'Test content',
		excerpt: 'Test excerpt',
	};

	registry
		.dispatch( coreDataStore )
		.receiveEntityRecords( 'root', 'media', mediaRecord );

	// The call to receiveEntityRecords will log a deprecation warning,
	// run all timers to flush timeouts and ensure that the warnings from the tests are logged.
	jest.runAllTimers();

	return registry;
}

describe( 'Deprecated entity logging - selectors', () => {
	describe.each( [
		{
			name: 'getEntityConfig',
			args: [ 'root', 'media' ],
		},
		{
			name: 'getEntityRecord',
			args: [ 'root', 'media', '123' ],
		},
		{
			name: 'getRawEntityRecord',
			args: [ 'root', 'media', '123' ],
		},
		{
			name: 'hasEntityRecords',
			args: [ 'root', 'media' ],
		},
		{
			name: 'getEntityRecords',
			args: [ 'root', 'media' ],
		},
		{
			name: 'getEntityRecordsTotalItems',
			args: [ 'root', 'media', { _fields: 'title' } ],
		},
		{
			name: 'getEntityRecordsTotalPages',
			args: [ 'root', 'media', { _fields: 'title' } ],
		},
		{
			name: 'getEntityRecordEdits',
			args: [ 'root', 'media', '123' ],
		},
		{
			name: 'getEntityRecordNonTransientEdits',
			args: [ 'root', 'media', '123' ],
		},
		{
			name: 'hasEditsForEntityRecord',
			args: [ 'root', 'media', '123' ],
		},
		{
			name: 'getEditedEntityRecord',
			args: [ 'root', 'media', '123' ],
		},
		{
			name: 'isAutosavingEntityRecord',
			args: [ 'root', 'media', '123' ],
		},
		{
			name: 'isSavingEntityRecord',
			args: [ 'root', 'media', '123' ],
		},
		{
			name: 'isDeletingEntityRecord',
			args: [ 'root', 'media', '123' ],
		},
		{
			name: 'getLastEntitySaveError',
			args: [ 'root', 'media', '123' ],
		},
		{
			name: 'getLastEntityDeleteError',
			args: [ 'root', 'media', '123' ],
		},
		{
			name: 'canUser',
			args: [ 'create', { kind: 'root', name: 'media' }, '123' ],
		},
		{
			name: 'getRevisions',
			args: [ 'root', 'media', '123' ],
		},
		{
			name: 'getRevision',
			args: [ 'root', 'media', '123', '10' ],
		},
		{
			name: 'getMedia',
			args: [ '123' ],
			isShorthandSelector: true,
			alternativeFunction: 'getEntityRecord',
		},
		{
			name: 'getMediaItems',
			args: [],
			isShorthandSelector: true,
			alternativeFunction: 'getEntityRecords',
		},
	] )(
		'$name',
		( { name, args, alternativeFunction, isShorthandSelector } ) => {
			beforeEach( () => {
				deprecated.mockReset();
			} );

			it( 'logs a deprecation warning when used with deprecated entities', () => {
				// Create a test registry with the actual store
				const registry = createTestRegistry();

				// Dispatch the action.
				registry.select( coreDataStore )[ name ]( ...args );

				const [ expectedMessage, expectedOptions ] =
					getExpectedDeprecationArgs(
						name,
						args,
						isShorthandSelector,
						alternativeFunction
					);

				expect( deprecated ).toHaveBeenCalledWith(
					expectedMessage,
					expectedOptions
				);
			} );
		}
	);
} );

describe( 'Deprecated entity logging - actions', () => {
	describe.each( [
		{
			name: 'receiveEntityRecords',
			args: [ 'root', 'media', { title: 'Media' } ],
		},
		{
			name: 'deleteEntityRecord',
			args: [ 'root', 'media', '123' ],
		},
		{
			name: 'editEntityRecord',
			args: [ 'root', 'media', '123', { title: 'Media' } ],
		},
		{
			name: 'saveEntityRecord',
			args: [ 'root', 'media', { title: 'Media' } ],
		},
		{
			name: 'saveEditedEntityRecord',
			args: [ 'root', 'media', '123' ],
		},
		{
			name: '__experimentalSaveSpecifiedEntityEdits',
			args: [ 'root', 'media', '123', [ 'title' ] ],
		},
		{
			name: 'receiveRevisions',
			args: [ 'root', 'media', '123', [ 'title' ] ],
		},
		{
			name: 'saveMedia',
			args: [ { title: 'Media' } ],
			alternativeFunction: 'saveEntityRecord',
			isShorthandSelector: true,
		},
		{
			name: 'deleteMedia',
			args: [ '123' ],
			alternativeFunction: 'deleteEntityRecord',
			isShorthandSelector: true,
		},
	] )(
		'$name',
		( { name, args, alternativeFunction, isShorthandSelector } ) => {
			beforeEach( () => {
				deprecated.mockReset();
			} );

			it( 'logs a deprecation warning when used with deprecated entities', () => {
				// Create a test registry with the actual store
				const registry = createTestRegistry();

				// Dispatch the action.
				registry.dispatch( coreDataStore )[ name ]( ...args );

				const [ expectedMessage, expectedOptions ] =
					getExpectedDeprecationArgs(
						name,
						args,
						isShorthandSelector,
						alternativeFunction
					);

				expect( deprecated ).toHaveBeenCalledWith(
					expectedMessage,
					expectedOptions
				);
			} );
		}
	);
} );
