<?php
/**
 * REST API: Gutenberg_REST_Terms_Controller_6_8 class
 *
 * @package    gutenberg
 * @subpackage REST_API
 * @since      6.8.0
 */
class Gutenberg_REST_Terms_Controller_6_8 extends WP_REST_Terms_Controller {
	/**
	 * Retrieves the query params for collections.
	 *
	 * @since 4.7.0
	 * @since 6.8.0 Added 'term_order' to the list of allowed orderby parameters.
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		$query_params = parent::get_collection_params();

		$query_params['orderby']['enum'][] = 'term_order';

		return $query_params;
	}
}
