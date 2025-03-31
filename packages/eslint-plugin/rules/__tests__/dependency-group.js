/**
 * External dependencies
 */
import { RuleTester } from 'eslint';

/**
 * Internal dependencies
 */
import rule from '../dependency-group';

const ruleTester = new RuleTester( {
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 6,
	},
} );

ruleTester.run( 'dependency-group', rule, {
	valid: [
		{
			code: `
/**
 * External dependencies
 */
import { camelCase } from 'change-case';
import clsx from 'clsx';;

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import edit from './edit';`,
		},
		{
			code: `
/**
 * External dependencies
 */
const { camelCase } = require( 'change-case' );
const clsx = require( 'clsx' );

/**
 * WordPress dependencies
 */
const { Component } = require( '@wordpress/element' );

/**
 * Internal dependencies
 */
const edit = require( './edit' );`,
		},
	],
	invalid: [
		{
			code: `
import { camelCase } from 'change-case';
import clsx from 'clsx';;
/*
 * wordpress dependencies.
 */
import { Component } from '@wordpress/element';
import edit from './edit';`,
			errors: [
				{
					message:
						'Expected preceding "External dependencies" comment block',
				},
				{
					message:
						'Expected preceding "WordPress dependencies" comment block',
				},
				{
					message:
						'Expected preceding "Internal dependencies" comment block',
				},
			],
			output: `
/**
 * External dependencies
 */
import { camelCase } from 'change-case';
import clsx from 'clsx';;
/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
/**
 * Internal dependencies
 */
import edit from './edit';`,
		},
		{
			code: `
const { camelCase } = require( 'change-case' );
const clsx = require( 'clsx' );
/*
 * wordpress dependencies.
 */
const { Component } = require( '@wordpress/element' );
const edit = require( './edit' );`,
			errors: [
				{
					message:
						'Expected preceding "External dependencies" comment block',
				},
				{
					message:
						'Expected preceding "WordPress dependencies" comment block',
				},
				{
					message:
						'Expected preceding "Internal dependencies" comment block',
				},
			],
			output: `
/**
 * External dependencies
 */
const { camelCase } = require( 'change-case' );
const clsx = require( 'clsx' );
/**
 * WordPress dependencies
 */
const { Component } = require( '@wordpress/element' );
/**
 * Internal dependencies
 */
const edit = require( './edit' );`,
		},
		{
			code: `
/**
 * External dependencies
 */
import { camelCase } from 'change-case';
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import lodash from 'lodash';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import edit from './edit';
import { __ } from '@wordpress/i18n';
import utils from './utils';
import constants from './constants';`,
			errors: [
				{
					message: 'Dependencies should be properly grouped',
				},
			],
			output: `
/**
 * External dependencies
 */
import { camelCase } from 'change-case';
import clsx from 'clsx';
import lodash from 'lodash';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import edit from './edit';
import utils from './utils';
import constants from './constants';`,
		},
	],
} );
