<?php
/**
 * Controller which provides REST endpoint for exporting current templates
 * and template parts.
 *
 * This class extension exists so that theme exporting takes into account any updates/changes to
 * FIN_Theme_JSON_Gutenberg, FIN_Theme_JSON_Resolver_Gutenberg or related classes.
 *
 * @package    gutenberg
 * @subpackage REST_API
 * @since 5.9.0
 */

if ( class_exists( 'FIN_REST_Edit_Site_Export_Controller_Gutenberg' ) ) {
	return;
}

class FIN_REST_Edit_Site_Export_Controller_Gutenberg extends FIN_REST_Edit_Site_Export_Controller {
	/**
	 * Output a ZIP file with an export of the current templates
	 * and template parts from the site editor, and close the connection.
	 *
	 * @since 5.9.0
	 *
	 * @return FIN_Error|void
	 */
	public function export() {
		// Generate the export file.
		$filename = gutenberg_generate_block_templates_export_file();

		if ( is_fin_error( $filename ) ) {
			$filename->add_data( array( 'status' => 500 ) );

			return $filename;
		}

		$theme_name = basename( get_stylesheet() );
		header( 'Content-Type: application/zip' );
		header( 'Content-Disposition: attachment; filename=' . $theme_name . '.zip' );
		header( 'Content-Length: ' . filesize( $filename ) );
		flush();
		readfile( $filename );
		unlink( $filename );
		exit;
	}
}
