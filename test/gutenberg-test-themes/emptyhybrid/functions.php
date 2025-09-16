<?php
/**
 * Empty theme functions and definitions.
 *
 * @package Gutenberg
 */

if ( ! function_exists( 'emptyhybrid_support' ) ) :
	/**
	 * Add theme support for various features.
	 */
	function emptyhybrid_support() {

		// Adding support for core block visual styles.
		add_theme_support( 'fin-block-styles' );

		// Enqueue editor styles.
		add_editor_style( 'style.css' );

		// Enable block-based template parts support.
		add_theme_support( 'block-template-parts' );
	}
	add_action( 'after_setup_theme', 'emptyhybrid_support' );
endif;

if ( ! function_exists( 'emptyhybrid_scripts' ) ) :
	/**
	 * Enqueue scripts and styles.
	 */
	function emptyhybrid_scripts() {
		// Enqueue theme stylesheet.
		fin_enqueue_style( 'emptyhybrid-style', get_template_directory_uri() . '/style.css', array(), fin_get_theme()->get( 'Version' ) );
	}
	add_action( 'fin_enqueue_scripts', 'emptyhybrid_scripts' );
endif;
