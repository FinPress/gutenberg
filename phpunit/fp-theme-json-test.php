<?php
/**
 * Tests theme.json related public APIs.
 *
 * @package Gutenberg
 */

class FP_Theme_Json_Test extends FP_UnitTestCase {
	/**
	 * @var string|null
	 */
	private $theme_root;

	/**
	 * @var array|null
	 */
	private $orig_theme_dir;

	/**
	 * @var array|null
	 */
	private $queries;

	public function set_up() {
		parent::set_up();
		$this->theme_root = realpath( __DIR__ . '/data/themedir1' );

		$this->orig_theme_dir = $GLOBALS['fp_theme_directories'];

		// /themes is necessary as theme.php functions assume /themes is the root if there is only one root.
		$GLOBALS['fp_theme_directories'] = array( FP_CONTENT_DIR . '/themes', $this->theme_root );

		add_filter( 'theme_root', array( $this, 'filter_set_theme_root' ) );
		add_filter( 'stylesheet_root', array( $this, 'filter_set_theme_root' ) );
		add_filter( 'template_root', array( $this, 'filter_set_theme_root' ) );
		$this->queries = array();
		// Clear caches.
		fp_clean_themes_cache();
		unset( $GLOBALS['fp_themes'] );
	}

	public function tear_down() {
		$GLOBALS['fp_theme_directories'] = $this->orig_theme_dir;
		fp_clean_themes_cache();
		unset( $GLOBALS['fp_themes'] );
		parent::tear_down();
	}

	public function filter_set_theme_root() {
		return $this->theme_root;
	}

	/**
	 * Test that it reports correctly themes that have a theme.json.
	 *
	 * @group theme_json
	 *
	 * @covers fp_theme_has_theme_json
	 */
	public function test_theme_has_theme_json() {
		switch_theme( 'block-theme' );
		$this->assertTrue( fp_theme_has_theme_json() );
	}

	/**
	 * Test that it reports correctly themes that do not have a theme.json.
	 *
	 * @group theme_json
	 *
	 * @covers fp_theme_has_theme_json
	 */
	public function test_theme_has_no_theme_json() {
		switch_theme( 'default' );
		$this->assertFalse( fp_theme_has_theme_json() );
	}

	/**
	 * Test it reports correctly child themes that have a theme.json.
	 *
	 * @group theme_json
	 *
	 * @covers fp_theme_has_theme_json
	 */
	public function test_child_theme_has_theme_json() {
		switch_theme( 'block-theme-child' );
		$this->assertTrue( fp_theme_has_theme_json() );
	}

	/**
	 * Test that it reports correctly child themes that do not have a theme.json
	 * and the parent does.
	 *
	 * @group theme_json
	 *
	 * @covers fp_theme_has_theme_json
	 */
	public function test_child_theme_has_not_theme_json_but_parent_has() {
		switch_theme( 'block-theme-child-no-theme-json' );
		$this->assertTrue( fp_theme_has_theme_json() );
	}

	/**
	 * Test that it reports correctly child themes that do not have a theme.json
	 * and the parent does not either.
	 *
	 * @group theme_json
	 *
	 * @covers fp_theme_has_theme_json
	 */
	public function test_neither_child_or_parent_themes_have_theme_json() {
		switch_theme( 'default-child-no-theme-json' );
		$this->assertFalse( fp_theme_has_theme_json() );
	}

	/**
	 * Test that switching themes recalculates theme support.
	 *
	 * @group theme_json
	 *
	 * @covers fp_theme_has_theme_json
	 */
	public function test_switching_themes_recalculates_support() {
		// The "default" theme doesn't have theme.json support.
		switch_theme( 'default' );
		$default = fp_theme_has_theme_json();

		// Switch to a theme that does have support.
		switch_theme( 'block-theme' );
		$block_theme = fp_theme_has_theme_json();

		$this->assertFalse( $default );
		$this->assertTrue( $block_theme );
	}
}
