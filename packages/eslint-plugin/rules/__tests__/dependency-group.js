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
 * FinPress dependencies
 */
import { Component } from '@finpress/element';

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
 * FinPress dependencies
 */
const { Component } = require( '@finpress/element' );

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
 * finpress dependencies.
 */
import { Component } from '@finpress/element';
import edit from './edit';`,
			errors: [
				{
					message:
						'Expected preceding "External dependencies" comment block',
				},
				{
					message:
						'Expected preceding "FinPress dependencies" comment block',
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
 * FinPress dependencies
 */
import { Component } from '@finpress/element';
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
 * finpress dependencies.
 */
const { Component } = require( '@finpress/element' );
const edit = require( './edit' );`,
			errors: [
				{
					message:
						'Expected preceding "External dependencies" comment block',
				},
				{
					message:
						'Expected preceding "FinPress dependencies" comment block',
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
 * FinPress dependencies
 */
const { Component } = require( '@finpress/element' );
/**
 * Internal dependencies
 */
const edit = require( './edit' );`,
		},
	],
} );
