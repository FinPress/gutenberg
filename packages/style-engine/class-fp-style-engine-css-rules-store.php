<?php
/**
 * FP_Style_Engine_CSS_Rules_Store
 *
 * A store for FP_Style_Engine_CSS_Rule objects.
 *
 * @package Gutenberg
 */

if ( ! class_exists( 'FP_Style_Engine_CSS_Rules_Store' ) ) {

	/**
	 * Holds, sanitizes, processes and prints CSS declarations for the Style Engine.
	 *
	 * @access private
	 */
	class FP_Style_Engine_CSS_Rules_Store {

		/**
		 * An array of named FP_Style_Engine_CSS_Rules_Store objects.
		 *
		 * @static
		 *
		 * @var FP_Style_Engine_CSS_Rules_Store[]
		 */
		protected static $stores = array();

		/**
		 * The store name.
		 *
		 * @var string
		 */
		protected $name = '';

		/**
		 * An array of CSS Rules objects assigned to the store.
		 *
		 * @var FP_Style_Engine_CSS_Rule[]
		 */
		protected $rules = array();

		/**
		 * Gets an instance of the store.
		 *
		 * @param string $store_name The name of the store.
		 *
		 * @return FP_Style_Engine_CSS_Rules_Store|void
		 */
		public static function get_store( $store_name = 'default' ) {
			if ( ! is_string( $store_name ) || empty( $store_name ) ) {
				return;
			}
			if ( ! isset( static::$stores[ $store_name ] ) ) {
				static::$stores[ $store_name ] = new static();
				// Set the store name.
				static::$stores[ $store_name ]->set_name( $store_name );
			}
			return static::$stores[ $store_name ];
		}

		/**
		 * Gets an array of all available stores.
		 *
		 * @return FP_Style_Engine_CSS_Rules_Store[]
		 */
		public static function get_stores() {
			return static::$stores;
		}

		/**
		 * Clears all stores from static::$stores.
		 *
		 * @return void
		 */
		public static function remove_all_stores() {
			static::$stores = array();
		}

		/**
		 * Sets the store name.
		 *
		 * @param string $name The store name.
		 *
		 * @return void
		 */
		public function set_name( $name ) {
			$this->name = $name;
		}

		/**
		 * Gets the store name.
		 *
		 * @return string
		 */
		public function get_name() {
			return $this->name;
		}

		/**
		 * Gets an array of all rules.
		 *
		 * @return FP_Style_Engine_CSS_Rule[]
		 */
		public function get_all_rules() {
			return $this->rules;
		}

		/**
		 * Gets a FP_Style_Engine_CSS_Rule object by its selector.
		 * If the rule does not exist, it will be created.
		 *
		 * @param string $selector    The CSS selector.
		 * @param string $rules_group A parent CSS selector in the case of nested CSS, or a CSS nested @rule, such as `@media (min-width: 80rem)` or `@layer module`..
		 *
		 * @return FP_Style_Engine_CSS_Rule|void Returns a FP_Style_Engine_CSS_Rule object, or null if the selector is empty.
		 */
		public function add_rule( $selector, $rules_group = '' ) {
			$selector    = $selector ? trim( $selector ) : '';
			$rules_group = $rules_group ? trim( $rules_group ) : '';

			// Bail early if there is no selector.
			if ( empty( $selector ) ) {
				return;
			}

			if ( ! empty( $rules_group ) ) {
				if ( empty( $this->rules[ "$rules_group $selector" ] ) ) {
					$this->rules[ "$rules_group $selector" ] = new FP_Style_Engine_CSS_Rule( $selector, array(), $rules_group );
				}
				return $this->rules[ "$rules_group $selector" ];
			}

			// Create the rule if it doesn't exist.
			if ( empty( $this->rules[ $selector ] ) ) {
				$this->rules[ $selector ] = new FP_Style_Engine_CSS_Rule( $selector );
			}

			return $this->rules[ $selector ];
		}

		/**
		 * Removes a selector from the store.
		 *
		 * @param string $selector The CSS selector.
		 *
		 * @return void
		 */
		public function remove_rule( $selector ) {
			unset( $this->rules[ $selector ] );
		}
	}
}
