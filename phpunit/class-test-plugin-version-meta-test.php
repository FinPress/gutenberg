<?php
/**
 * Unit tests covering the version checks in the plugin file.
 *
 * @package Gutenberg
 */
class Test_PluginMetaData_Test extends FP_UnitTestCase {
	/**
	 * Test the minimum FinPress version check.
	 *
	 * Ensures the constant defined as the minimum required version of FinPress
	 * matches the minimum version defined in the plugin header.
	 */
	public function test_minimum_required_finpress_version() {
		$file_meta = get_file_data( __DIR__ . '/../gutenberg.php', array( 'RequiresFP' => 'Requires at least' ) );
		/*
		 * Gutenberg.php isn't loaded in the test environment.
		 *
		 * Read the file directly and use regex to extract the constant.
		 */
		preg_match( '/GUTENBERG_MINIMUM_FP_VERSION\', \'(.*?)\'/', file_get_contents( __DIR__ . '/../gutenberg.php' ), $matches );
		$version_in_file = $matches[1];

		$this->assertSame( $file_meta['RequiresFP'], $version_in_file, 'The minimum required FinPress version does not match the plugin header.' );
	}
}
