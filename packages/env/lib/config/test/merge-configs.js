'use strict';
/**
 * Internal dependencies
 */
const mergeConfigs = require( '../merge-configs' );

describe( 'mergeConfigs', () => {
	it( 'should merge configs without environments', () => {
		const merged = mergeConfigs(
			{
				port: 8888,
				coreSource: {
					type: 'local',
					path: '/home/test',
				},
				config: {
					FP_TEST: 'test',
				},
				lifecycleScripts: {
					afterStart: 'test',
				},
			},
			{
				port: 8889,
				config: {
					FP_TEST_2: 'test-2',
				},
				lifecycleScripts: {
					afterDestroy: 'test-2',
				},
			}
		);

		expect( merged ).toEqual( {
			port: 8889,
			coreSource: {
				type: 'local',
				path: '/home/test',
			},
			config: {
				FP_TEST: 'test',
				FP_TEST_2: 'test-2',
			},
			lifecycleScripts: {
				afterStart: 'test',
				afterDestroy: 'test-2',
			},
		} );
	} );

	it( 'should merge configs with environments', () => {
		const merged = mergeConfigs(
			{
				port: 8888,
				coreSource: {
					type: 'local',
					path: '/home/test',
				},
				config: {
					FP_TEST: 'test',
				},
				env: {
					development: {
						config: {
							FP_TEST_3: 'test-3',
						},
					},
					tests: {
						config: {
							FP_TEST_4: 'test-4',
						},
					},
				},
			},
			{
				port: 8889,
				config: {
					FP_TEST_2: 'test-2',
				},
				env: {
					development: {
						config: {
							FP_TEST_5: 'test-5',
						},
					},
					tests: {
						config: {
							FP_TEST_6: 'test-6',
						},
					},
				},
			}
		);

		expect( merged ).toEqual( {
			port: 8889,
			coreSource: {
				type: 'local',
				path: '/home/test',
			},
			config: {
				FP_TEST: 'test',
				FP_TEST_2: 'test-2',
			},
			env: {
				development: {
					config: {
						FP_TEST_3: 'test-3',
						FP_TEST_5: 'test-5',
					},
				},
				tests: {
					config: {
						FP_TEST_4: 'test-4',
						FP_TEST_6: 'test-6',
					},
				},
			},
		} );
	} );
} );
