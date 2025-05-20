<?php
/**
 * Interactivity API: Experimental full-page client-side navigation.
 *
 * @package    Gutenberg
 * @subpackage Interactivity API
 */

if ( ! class_exists( 'Gutenberg_Interactivity_API_Full_Page_Navigation' ) ) {

	/**
	 * Class Gutenberg_Interactivity_API_Full_Page_Navigation.
	 */
	class Gutenberg_Interactivity_API_Full_Page_Navigation {

		private static $instance = null;

		public static function instance() {
			if ( null === self::$instance ) {
				self::$instance = new Gutenberg_Interactivity_API_Full_Page_Navigation();
			}
			return self::$instance;
		}

		public static function instance() {
			if ( null === self::$instance ) {
				self::$instance = new WP_Interactivity_API_Full_Page_Navigation();
			}
			return self::$instance;
		}

		public function __construct() {
			add_action( 'wp_head', array( $this, 'buffer_start' ) );
			add_action( 'wp_footer', array( $this, 'buffer_end' ), 8 );
			add_action( 'wp_footer', array( $this, 'core_image_lightbox_buffer_start' ), 9 );
			add_action( 'wp_footer', array( $this, 'core_image_lightbox_buffer_end' ), 11 );
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_script_modules' ) );
		}

		/**
		 * Enqueues the required script modules.
		 */
		public function enqueue_script_modules() {
			wp_enqueue_script_module(
				'@wordpress/interactivity-router/full-page'
			);
		}

		/**
		 * Starts output buffering at the end of the 'wp_head' action, adding the
		 * required directives for client-side navigation to the BODY tags when the
		 * buffer is flushed.
		 */
		public function buffer_start() {
			ob_start( array( $this, 'add_directives_to_body' ) );
		}

		/**
		 * Flushes the output buffer at the end of the 'wp_footer' action.
		 */
		public function buffer_end() {
			ob_end_flush();
		}

		/**
		 * Adds client-side navigation directives to BODY tag in the passed output
		 * buffer.
		 *
		 * Note: This should probably be done per site, not by default when this option
		 * is enabled.
		 *
		 * @param string $buffer Passed output buffer.
		 *
		 * @return string The same HTML with modified BODY attributes.
		 */
		public function add_directives_to_body( $buffer ) {
			$p = new WP_HTML_Tag_Processor( $buffer );
			if ( $p->next_tag( array( 'tag_name' => 'BODY' ) ) ) {
				$p->set_attribute( 'data-wp-interactive', true );
				$p->set_attribute( 'data-wp-router-region', 'core/body' );
				return $p->get_updated_html();
			} else {
				return $buffer;
			}
		}

		/**
		 * Modifies the lightbox element injected by the `core/image` block.
		 *
		 * This function appends new directives to make this element compatible with
		 * the full-page client-side navigation feature.
		 *
		 * @param string $buffer Passed output buffer.
		 *
		 * @return string Same HTML with new directives.
		 */
		public function add_lightbox_region_directives( $buffer ) {
			$p = new WP_HTML_Tag_Processor( $buffer );
			if ( $p->next_tag( array( 'class_name' => 'wp-lightbox-overlay' ) ) ) {
				$p->set_attribute( 'data-wp-router-region', '{ "id": "core/body", "attachTo": "body" }' );
				$p->set_attribute( 'data-wp-key', 'wp-lightbox-overlay' );
				$p->set_attribute( 'data-wp-class--show-closing-animation', 'state.overlayOpened' );
				return $p->get_updated_html();
			} else {
				return $buffer;
			}
		}

		/**
		 * Starts buffering the output to capture the lightbox element markup.
		 */
		public function core_image_lightbox_buffer_start() {
			ob_start( array( $this, 'add_lightbox_region_directives' ) );
		}

		/**
		 * Stops and flushes the captured lightbox element markup with new
		 * directives for compatibility with the full-page navigation.
		 */
		public function core_image_lightbox_buffer_end() {
			ob_end_flush();
		}
	}
}
