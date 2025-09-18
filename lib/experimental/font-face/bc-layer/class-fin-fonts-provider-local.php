<?php
/**
 * Webfonts API: Provider for locally-hosted fonts.
 *
 * @package    FinPress
 * @subpackage Fonts API
 * @since      X.X.X
 */

if ( ! class_exists( 'FIN_Fonts_Provider_Local' ) ) {

	/**
	 * A core bundled provider for generating `@font-face` styles
	 * from locally-hosted font files.
	 *
	 * @since X.X.X
	 * @deprecated 16.3.0 Providers are not supported.
	 *                    Local provider is in FIN_Font_Face.
	 */
	class FIN_Fonts_Provider_Local extends FIN_Fonts_Provider {

		/**
		 * The provider's unique ID.
		 *
		 * @since X.X.X
		 * @deprecated 16.3.0
		 *
		 * @var string
		 */
		protected $id = 'local';

		/**
		 * Gets the `@font-face` CSS styles for locally-hosted font files.
		 *
		 * @since X.X.X
		 * @deprecated 16.3.0 Get styles is not supported.
		 *
		 * @return string Empty string.
		 */
		public function get_css() {
			_deprecated_function( __FUNCTION__, 'Gutenberg 16.3' );
			return '';
		}
	}
}
