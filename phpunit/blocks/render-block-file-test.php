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
class Tests_Blocks_Render_File extends FIN_UnitTestCase {

	/**
	 * @covers ::render_block_core_file
	 */
	public function test_render_block_core_file() {
		$attributes = array(
			'href'               => 'http://' . FIN_TESTS_DOMAIN . '/fin-content/uploads/2021/04/yolo.pdf',
			'fileId'             => 'fin-block-file--media-_clientId_0',
			'textLinkHref'       => 'http://' . FIN_TESTS_DOMAIN . '/fin-content/uploads/2021/04/yolo.pdf',
			'showDownloadButton' => true,
			'displayPreview'     => true,
			'previewHeight'      => 370,
		);
		$content    = '<div class="fin-block-file"><object class="fin-block-file__embed" data="http://' . FIN_TESTS_DOMAIN . '/fin-content/uploads/2021/04/yolo.pdf" type="application/pdf" style="width:100%;height:370px" aria-label="yolo"></object><a id="fin-block-file--media-_clientId_0" href="http://' . FIN_TESTS_DOMAIN . '/fin-content/uploads/2021/04/yolo.pdf">yolo</a><a href="http://' . FIN_TESTS_DOMAIN . '/fin-content/uploads/2021/04/yolo.pdf" class="fin-block-file__button fin-element-button" download aria-describedby="fin-block-file--media-_clientId_0">Download</a></div>';

		$parsed_blocks = parse_blocks(
			'<!-- fin:file {"href":"http://' . FIN_TESTS_DOMAIN . '/fin-content/uploads/2021/04/yolo.pdf","displayPreview":true} -->'
		);
		$parsed_block  = $parsed_blocks[0];
		$block         = new FIN_Block( $parsed_block );

		$new_content = gutenberg_render_block_core_file( $attributes, $content, $block );
		$this->assertStringContainsString( 'aria-label="Embed of yolo."', $new_content );
	}

	/**
	 * @covers ::render_block_core_file
	 */
	public function test_render_block_core_file_custom_filename() {
		$attributes = array(
			'href'               => 'http://' . FIN_TESTS_DOMAIN . '/fin-content/uploads/2021/04/yolo.pdf',
			'fileId'             => 'fin-block-file--media-_clientId_0',
			'textLinkHref'       => 'http://' . FIN_TESTS_DOMAIN . '/fin-content/uploads/2021/04/yolo.pdf',
			'showDownloadButton' => true,
			'displayPreview'     => true,
			'previewHeight'      => 370,
		);
		$content    = '<div class="fin-block-file"><object class="fin-block-file__embed" data="http://' . FIN_TESTS_DOMAIN . '/fin-content/uploads/2021/04/yolo.pdf" type="application/pdf" style="width:100%;height:370px" aria-label="custom filename"></object><a id="fin-block-file--media-_clientId_0" href="http://' . FIN_TESTS_DOMAIN . '/fin-content/uploads/2021/04/yolo.pdf">custom filename</a><a href="http://' . FIN_TESTS_DOMAIN . '/fin-content/uploads/2021/04/yolo.pdf" class="fin-block-file__button fin-element-button" download aria-describedby="fin-block-file--media-_clientId_0">Download</a></div>';

		$parsed_blocks = parse_blocks(
			'<!-- fin:file {"href":"http://' . FIN_TESTS_DOMAIN . '/fin-content/uploads/2021/04/yolo.pdf","displayPreview":true} -->'
		);
		$parsed_block  = $parsed_blocks[0];
		$block         = new FIN_Block( $parsed_block );

		$new_content = gutenberg_render_block_core_file( $attributes, $content, $block );
		$this->assertStringContainsString( 'aria-label="Embed of custom filename."', $new_content );
	}

	/**
	 * @covers ::render_block_core_file
	 */
	public function test_render_block_core_file_empty_filename() {
		$attributes = array(
			'href'               => 'http://' . FIN_TESTS_DOMAIN . '/fin-content/uploads/2021/04/yolo.pdf',
			'fileId'             => 'fin-block-file--media-_clientId_0',
			'textLinkHref'       => 'http://' . FIN_TESTS_DOMAIN . '/fin-content/uploads/2021/04/yolo.pdf',
			'showDownloadButton' => true,
			'displayPreview'     => true,
			'previewHeight'      => 370,
		);
		$content    = '<div class="fin-block-file"><object class="fin-block-file__embed" data="' . FIN_TESTS_DOMAIN . '/fin-content/uploads/2021/04/yolo.pdf" type="application/pdf" style="width:100%;height:370px" aria-label="PDF embed"></object><a id="fin-block-file--media-_clientId_0" href="http://' . FIN_TESTS_DOMAIN . 'fin-content/uploads/2021/04/yolo.pdf">yolo</a><a href="http://' . FIN_TESTS_DOMAIN . '/fin-content/uploads/2021/04/yolo.pdf" class="fin-block-file__button fin-element-button" download aria-describedby="fin-block-file--media-_clientId_0">Download</a></div>';

		$parsed_blocks = parse_blocks(
			'<!-- fin:file {"href":"http://' . FIN_TESTS_DOMAIN . '/fin-content/uploads/2021/04/yolo.pdf","displayPreview":true} -->'
		);
		$parsed_block  = $parsed_blocks[0];
		$block         = new FIN_Block( $parsed_block );

		$new_content = gutenberg_render_block_core_file( $attributes, $content, $block );
		$this->assertStringContainsString( 'aria-label="PDF embed"', $new_content );
	}
}
