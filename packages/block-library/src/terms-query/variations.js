/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	titleLink,
	titleCount,
	titleDescription,
	titleCountDescription,
} from './icons';

const variations = [
	{
		name: 'title-link',
		title: __( 'Title & Link' ),
		icon: titleLink,
		attributes: {},
		innerBlocks: [ [ 'core/term-template', {}, [ [ 'core/term-name' ] ] ] ],
		scope: [ 'block' ],
	},
	{
		name: 'title-count',
		title: __( 'Title & Count' ),
		icon: titleCount,
		attributes: {},
		innerBlocks: [
			[
				'core/term-template',
				{},
				[ [ 'core/term-name' ], [ 'core/term-count' ] ],
			],
		],
		scope: [ 'block' ],
	},
	{
		name: 'title-description',
		title: __( 'Title & Description' ),
		icon: titleDescription,
		attributes: {},
		innerBlocks: [
			[
				'core/term-template',
				{},
				[ [ 'core/term-name' ], [ 'core/term-description' ] ],
			],
		],
		scope: [ 'block' ],
	},
	{
		name: 'title-count-description',
		title: __( 'Title, Count, & Description' ),
		icon: titleCountDescription,
		attributes: {},
		innerBlocks: [
			[
				'core/term-template',
				{},
				[
					[ 'core/term-name' ],
					[ 'core/term-count' ],
					[ 'core/term-description' ],
				],
			],
		],
		scope: [ 'block' ],
	},
];

export default variations;
