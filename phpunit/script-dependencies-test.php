<?php

/**
 * @group script-dependencies
 */
class Test_Script_Dependencies extends FP_UnitTestCase {
	/**
	 * The `fp-fileds` was accidintally bundled in FP 6.7, but removed later.
	 * It's is listed here to avoid breaking previous FP version tests.
	 *
	 * @var array
	 */
	public $bundled_scripts = array( 'fp-upload-media', 'fp-fields' );

	/**
	 * Tests for accidental `fp-polyfill` script dependents.
	 */
	public function test_polyfill_dependents() {
		$scripts            = fp_scripts();
		$registered_scripts = $scripts->registered;
		$dependents         = array();

		// Iterate over all registered scripts, finding dependents of the `fp-polyfill` script.
		// Based on private `FP_Scripts::get_dependents` method.
		foreach ( $registered_scripts as $registered_handle => $args ) {
			// Ignore bundled packages, they don't load separate polyfills.
			if ( in_array( $registered_handle, $this->bundled_scripts, true ) ) {
				continue;
			}

			if ( in_array( 'fp-polyfill', $args->deps, true ) ) {
				$dependents[] = $registered_handle;
			}
		}

		// This list should get smaller over time as we remove `fp-polyfill` dependencies.
		// If the list update is intentional, please add a comment explaining why.
		$expected = array(
			'react',
			'fp-blob',
			'fp-block-editor',
			'fp-block-library',
			'fp-blocks',
			'fp-edit-site',
			'fp-core-data',
			'fp-editor',
			'fp-router',
			'fp-url',
			'fp-widgets',
		);

		$this->assertEqualSets( $expected, $dependents );
	}
}
