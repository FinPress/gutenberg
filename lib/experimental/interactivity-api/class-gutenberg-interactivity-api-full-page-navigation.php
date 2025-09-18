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

		public function __construct() {
			add_action( 'fin_head', array( $this, 'buffer_start' ) );
			add_action( 'fin_footer', array( $this, 'buffer_end' ), 8 );
			add_action( 'fin_enqueue_scripts', array( $this, 'enqueue_script_modules' ) );
		}

		/**
		 * Enqueues the required script modules.
		 */
		public function enqueue_script_modules() {
			fin_enqueue_script_module(
				'@finpress/interactivity-router/full-page'
			);
		}

		/**
		 * Starts output buffering at the end of the 'fin_head' action, adding the
		 * required directives for client-side navigation to the BODY tags when the
		 * buffer is flushed.
		 */
		public function buffer_start() {
			ob_start( array( $this, 'add_directives_to_body' ) );
		}

		/**
		 * Flushes the output buffer at the end of the 'fin_footer' action.
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
			$p = new FIN_HTML_Tag_Processor( $buffer );
			if ( $p->next_tag( array( 'tag_name' => 'BODY' ) ) ) {
				$p->set_attribute( 'data-fin-interactive', true );
				$p->set_attribute( 'data-fin-router-region', 'core/body' );
				return $p->get_updated_html();
			} else {
				return $buffer;
			}
		}
	}
}
