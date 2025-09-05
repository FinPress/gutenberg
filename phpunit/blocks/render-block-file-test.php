<?php
/**
 * File block rendering tests.
 *
 * @package FinPress
 * @subpackage Blocks
 */

/**
 * Tests for the File block.
 *
 * @group blocks
 */
class Tests_Blocks_Render_File extends FP_UnitTestCase {

	/**
	 * @covers ::render_block_core_file
	 */
	public function test_render_block_core_file() {
		$attributes = array(
			'href'               => 'http://' . FP_TESTS_DOMAIN . '/fp-content/uploads/2021/04/yolo.pdf',
			'fileId'             => 'fp-block-file--media-_clientId_0',
			'textLinkHref'       => 'http://' . FP_TESTS_DOMAIN . '/fp-content/uploads/2021/04/yolo.pdf',
			'showDownloadButton' => true,
			'displayPreview'     => true,
			'previewHeight'      => 370,
		);
		$content    = '<div class="fp-block-file"><object class="fp-block-file__embed" data="http://' . FP_TESTS_DOMAIN . '/fp-content/uploads/2021/04/yolo.pdf" type="application/pdf" style="width:100%;height:370px" aria-label="yolo"></object><a id="fp-block-file--media-_clientId_0" href="http://' . FP_TESTS_DOMAIN . '/fp-content/uploads/2021/04/yolo.pdf">yolo</a><a href="http://' . FP_TESTS_DOMAIN . '/fp-content/uploads/2021/04/yolo.pdf" class="fp-block-file__button fp-element-button" download aria-describedby="fp-block-file--media-_clientId_0">Download</a></div>';

		$parsed_blocks = parse_blocks(
			'<!-- fp:file {"href":"http://' . FP_TESTS_DOMAIN . '/fp-content/uploads/2021/04/yolo.pdf","displayPreview":true} -->'
		);
		$parsed_block  = $parsed_blocks[0];
		$block         = new FP_Block( $parsed_block );

		$new_content = gutenberg_render_block_core_file( $attributes, $content, $block );
		$this->assertStringContainsString( 'aria-label="Embed of yolo."', $new_content );
	}

	/**
	 * @covers ::render_block_core_file
	 */
	public function test_render_block_core_file_custom_filename() {
		$attributes = array(
			'href'               => 'http://' . FP_TESTS_DOMAIN . '/fp-content/uploads/2021/04/yolo.pdf',
			'fileId'             => 'fp-block-file--media-_clientId_0',
			'textLinkHref'       => 'http://' . FP_TESTS_DOMAIN . '/fp-content/uploads/2021/04/yolo.pdf',
			'showDownloadButton' => true,
			'displayPreview'     => true,
			'previewHeight'      => 370,
		);
		$content    = '<div class="fp-block-file"><object class="fp-block-file__embed" data="http://' . FP_TESTS_DOMAIN . '/fp-content/uploads/2021/04/yolo.pdf" type="application/pdf" style="width:100%;height:370px" aria-label="custom filename"></object><a id="fp-block-file--media-_clientId_0" href="http://' . FP_TESTS_DOMAIN . '/fp-content/uploads/2021/04/yolo.pdf">custom filename</a><a href="http://' . FP_TESTS_DOMAIN . '/fp-content/uploads/2021/04/yolo.pdf" class="fp-block-file__button fp-element-button" download aria-describedby="fp-block-file--media-_clientId_0">Download</a></div>';

		$parsed_blocks = parse_blocks(
			'<!-- fp:file {"href":"http://' . FP_TESTS_DOMAIN . '/fp-content/uploads/2021/04/yolo.pdf","displayPreview":true} -->'
		);
		$parsed_block  = $parsed_blocks[0];
		$block         = new FP_Block( $parsed_block );

		$new_content = gutenberg_render_block_core_file( $attributes, $content, $block );
		$this->assertStringContainsString( 'aria-label="Embed of custom filename."', $new_content );
	}

	/**
	 * @covers ::render_block_core_file
	 */
	public function test_render_block_core_file_empty_filename() {
		$attributes = array(
			'href'               => 'http://' . FP_TESTS_DOMAIN . '/fp-content/uploads/2021/04/yolo.pdf',
			'fileId'             => 'fp-block-file--media-_clientId_0',
			'textLinkHref'       => 'http://' . FP_TESTS_DOMAIN . '/fp-content/uploads/2021/04/yolo.pdf',
			'showDownloadButton' => true,
			'displayPreview'     => true,
			'previewHeight'      => 370,
		);
		$content    = '<div class="fp-block-file"><object class="fp-block-file__embed" data="' . FP_TESTS_DOMAIN . '/fp-content/uploads/2021/04/yolo.pdf" type="application/pdf" style="width:100%;height:370px" aria-label="PDF embed"></object><a id="fp-block-file--media-_clientId_0" href="http://' . FP_TESTS_DOMAIN . 'fp-content/uploads/2021/04/yolo.pdf">yolo</a><a href="http://' . FP_TESTS_DOMAIN . '/fp-content/uploads/2021/04/yolo.pdf" class="fp-block-file__button fp-element-button" download aria-describedby="fp-block-file--media-_clientId_0">Download</a></div>';

		$parsed_blocks = parse_blocks(
			'<!-- fp:file {"href":"http://' . FP_TESTS_DOMAIN . '/fp-content/uploads/2021/04/yolo.pdf","displayPreview":true} -->'
		);
		$parsed_block  = $parsed_blocks[0];
		$block         = new FP_Block( $parsed_block );

		$new_content = gutenberg_render_block_core_file( $attributes, $content, $block );
		$this->assertStringContainsString( 'aria-label="PDF embed"', $new_content );
	}
}
