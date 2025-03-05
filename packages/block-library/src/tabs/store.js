/**
 * WordPress dependencies
 */
import { register } from '@wordpress/data';

const STORE_NAME = 'core/tabs';

// This is a custom and simple wordpress/data redux data store for core/tabs. It only tracks the last active tab.

const store = register( STORE_NAME, {} );
