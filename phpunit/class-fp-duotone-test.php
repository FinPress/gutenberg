<?php

/**
 * Test the block FP_Duotone_Gutenberg class.
 *
 * @package Gutenberg
 */

class FP_Duotone_Gutenberg_Test extends FP_UnitTestCase {
	/**
	 * Cleans up CSS added to block-supports from duotone styles. We need to do this
	 * in order to avoid impacting other tests.
	 */
	public static function fpTearDownAfterClass() {
		FP_Style_Engine_CSS_Rules_Store_Gutenberg::remove_all_stores();
	}

	public function test_gutenberg_render_duotone_support_preset() {
		$block         = array(
			'blockName' => 'core/image',
			'attrs'     => array( 'style' => array( 'color' => array( 'duotone' => 'var:preset|duotone|blue-orange' ) ) ),
		);
		$block_content = '<figure class="fp-block-image size-full"><img src="/my-image.jpg" /></figure>';
		$expected      = '<figure class="fp-block-image size-full fp-duotone-blue-orange"><img src="/my-image.jpg" /></figure>';
		$this->assertSame( $expected, FP_Duotone_Gutenberg::render_duotone_support( $block_content, $block ) );
	}

	public function test_gutenberg_render_duotone_support_css() {
		$block         = array(
			'blockName' => 'core/image',
			'attrs'     => array( 'style' => array( 'color' => array( 'duotone' => 'unset' ) ) ),
		);
		$block_content = '<figure class="fp-block-image size-full"><img src="/my-image.jpg" /></figure>';
		$expected      = '/<figure class="fp-block-image size-full fp-duotone-unset-\d+"><img src="\\/my-image.jpg" \\/><\\/figure>/';
		$this->assertMatchesRegularExpression( $expected, FP_Duotone_Gutenberg::render_duotone_support( $block_content, $block ) );
	}

	public function test_gutenberg_render_duotone_support_custom() {
		$block         = array(
			'blockName' => 'core/image',
			'attrs'     => array( 'style' => array( 'color' => array( 'duotone' => array( '#FFFFFF', '#000000' ) ) ) ),
		);
		$block_content = '<figure class="fp-block-image size-full"><img src="/my-image.jpg" /></figure>';
		$expected      = '/<figure class="fp-block-image size-full fp-duotone-ffffff-000000-\d+"><img src="\\/my-image.jpg" \\/><\\/figure>/';
		$this->assertMatchesRegularExpression( $expected, FP_Duotone_Gutenberg::render_duotone_support( $block_content, $block ) );
	}


	/**
	 * Tests whether the CSS declarations are generated even if the block content is
	 * empty. This is needed to make the CSS output stable across paginations for
	 * features like the enhanced pagination of the Query block.
	 *
	 * @covers ::render_duotone_support
	 */
	public function test_gutenberg_css_declarations_are_generated_even_with_empty_block_content() {
		$block    = array(
			'blockName' => 'core/image',
			'attrs'     => array( 'style' => array( 'color' => array( 'duotone' => 'var:preset|duotone|blue-orange' ) ) ),
		);
		$fp_block = new FP_Block( $block );

		/*
		 * Handling to access the static FP_Duotone::$block_css_declarations property.
		 *
		 * Why is an instance needed?
		 * FP_Duotone is a static class by design, meaning it only contains static properties and methods.
		 * In production, it should not be instantiated. However, as of PHP 8.3, ReflectionProperty::setValue()
		 * needs an object.
		 */
		$fp_duotone                      = new FP_Duotone_Gutenberg();
		$block_css_declarations_property = new ReflectionProperty( 'FP_Duotone_Gutenberg', 'block_css_declarations' );
		$block_css_declarations_property->setAccessible( true );
		$previous_value = $block_css_declarations_property->getValue();
		$block_css_declarations_property->setValue( $fp_duotone, array() );
		FP_Duotone_Gutenberg::render_duotone_support( '', $block, $fp_block );
		$actual = $block_css_declarations_property->getValue();

		// Reset the property.
		$block_css_declarations_property->setValue( $fp_duotone, $previous_value );
		$block_css_declarations_property->setAccessible( false );

		$this->assertNotEmpty( $actual );
	}

	public function data_get_slug_from_attribute() {
		return array(
			'pipe-slug'                       => array( 'var:preset|duotone|blue-orange', 'blue-orange' ),
			'css-var'                         => array( 'var(--fp--preset--duotone--blue-orange)', 'blue-orange' ),
			'css-var-invalid-slug-chars'      => array( 'var(--fp--preset--duotone--.)', '.' ),
			'css-var-missing-end-parenthesis' => array( 'var(--fp--preset--duotone--blue-orange', '' ),
			'invalid'                         => array( 'not a valid attribute', '' ),
			'css-var-no-value'                => array( 'var(--fp--preset--duotone--)', '' ),
			'pipe-slug-no-value'              => array( 'var:preset|duotone|', '' ),
			'css-var-spaces'                  => array( 'var(--fp--preset--duotone--    ', '' ),
			'pipe-slug-spaces'                => array( 'var:preset|duotone|  ', '' ),
		);
	}

	/**
	 * @dataProvider data_get_slug_from_attribute
	 */
	public function test_get_slug_from_attribute( $data_attr, $expected ) {

		$reflection = new ReflectionMethod( 'FP_Duotone_Gutenberg', 'get_slug_from_attribute' );
		$reflection->setAccessible( true );

		$this->assertSame( $expected, $reflection->invoke( null, $data_attr ) );
	}

	public function data_is_preset() {
		return array(
			'pipe-slug'                       => array( 'var:preset|duotone|blue-orange', true ),
			'css-var'                         => array( 'var(--fp--preset--duotone--blue-orange)', true ),
			'css-var-invalid-slug-chars'      => array( 'var(--fp--preset--duotone--.)', false ),
			'css-var-missing-end-parenthesis' => array( 'var(--fp--preset--duotone--blue-orange', false ),
			'invalid'                         => array( 'not a valid attribute', false ),
		);
	}

	/**
	 * @dataProvider data_is_preset
	 */
	public function test_is_preset( $data_attr, $expected ) {
		$reflection = new ReflectionMethod( 'FP_Duotone_Gutenberg', 'is_preset' );
		$reflection->setAccessible( true );

		$this->assertSame( $expected, $reflection->invoke( null, $data_attr ) );
	}
}
