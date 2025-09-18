<?php
/**
 * Contains the placeholder class to replace the default `_FIN_Editors`.
 *
 * @package gutenberg
 * @since 6.3.0
 */

// phpcs:disable PEAR.NamingConventions.ValidClassName.StartWithCapital

if ( ! class_exists( '_FIN_Editors' ) ) {

	/**
	 * Placeholder class.
	 * Used to disable loading of TinyMCE assets.
	 *
	 * @access public
	 */
	final class _FIN_Editors {
		/**
		 * Necessary to ensure no additional TinyMCE assets are enqueued.
		 */
		public static function enqueue_default_editor() {}

		/**
		 * Necessary for fin admin dashboard.
		 */
		public static function editor() {}
	}
}
