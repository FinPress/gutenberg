<?php
/**
 * REST API: Gutenberg_REST_Block_Types_Controller_6_8 class
 *
 * @package gutenberg
 */

/**
 * Gutenberg_REST_Block_Types_Controller_6_8 class
 *
 * Add default controls to the block type response and schema to support
 * stabilization of `__expermentalDefaultControls` from within `supports`
 * to it's own top-level block type property.
 */
class Gutenberg_REST_Block_Types_Controller_6_8 extends WP_REST_Block_Types_Controller {
	/**
	 * Add default_controls to the item schema.
	 *
	 * @return array Item schema data.
	 */
	public function get_item_schema() {
		$schema                                   = parent::get_item_schema();
		$schema['properties']['default_controls'] = array(
			'description' => __( 'UI controls to display by default.' ),
			'type'        => 'object',
			'default'     => array(),
			'properties'  => array(),
			'context'     => array( 'embed', 'view', 'edit' ),
			'readonly'    => true,
		);
		return $schema;
	}

	/**
	 * Add default_controls to the response.
	 *
	 * @param WP_Block_Type   $block_type Block type object.
	 * @param WP_REST_Request $request    Request object.
	 * @return WP_REST_Response
	 */
	public function prepare_item_for_response( $block_type, $request ) {
		$response                 = parent::prepare_item_for_response( $block_type, $request );
		$default_controls         = $block_type->default_controls ?? $this->default_controls_schema['default'];
		$data                     = $response->get_data();
		$data['default_controls'] = rest_sanitize_value_from_schema(
			$default_controls,
			array(
				'description' => __( 'UI controls to display by default.' ),
				'type'        => 'object',
				'default'     => array(),
				'properties'  => array(),
				'context'     => array( 'embed', 'view', 'edit' ),
				'readonly'    => true,
			)
		);
		$response->set_data( $data );
		return $response;
	}
}


add_action(
	'rest_api_init',
	function () {
		$controller = new Gutenberg_REST_Block_Types_Controller_6_8();
		$controller->register_routes();
	}
);
