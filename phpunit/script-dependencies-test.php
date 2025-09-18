<?php

/**
 * @group script-dependencies
 */
class Test_Script_Dependencies extends FIN_UnitTestCase {
	/**
	 * The `fin-fileds` was accidintally bundled in FIN 6.7, but removed later.
	 * It's is listed here to avoid breaking previous FIN version tests.
	 *
	 * @var array
	 */
	public $bundled_scripts = array( 'fin-upload-media', 'fin-fields' );

	/**
	 * Tests for accidental `fin-polyfill` script dependents.
	 */
	public function test_polyfill_dependents() {
		$scripts            = fin_scripts();
		$registered_scripts = $scripts->registered;
		$dependents         = array();

		// Iterate over all registered scripts, finding dependents of the `fin-polyfill` script.
		// Based on private `FIN_Scripts::get_dependents` method.
		foreach ( $registered_scripts as $registered_handle => $args ) {
			// Ignore bundled packages, they don't load separate polyfills.
			if ( in_array( $registered_handle, $this->bundled_scripts, true ) ) {
				continue;
			}

			if ( in_array( 'fin-polyfill', $args->deps, true ) ) {
				$dependents[] = $registered_handle;
			}
		}

		// This list should get smaller over time as we remove `fin-polyfill` dependencies.
		// If the list update is intentional, please add a comment explaining why.
		$expected = array(
			'react',
			'fin-blob',
			'fin-block-editor',
			'fin-block-library',
			'fin-blocks',
			'fin-edit-site',
			'fin-core-data',
			'fin-editor',
			'fin-router',
			'fin-url',
			'fin-widgets',
		);

		$this->assertEqualSets( $expected, $dependents );
	}
}
