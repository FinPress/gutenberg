/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { NEW_TAB_REL, NOFOLLOW_REL } from './constants';

// Migration function to convert old attributes to new rel-based structure
const migrateToRelAttribute = ( attributes ) => {
	const { opensInNewTab, nofollow, rel = '', ...restAttributes } = attributes;

	// If no opensInNewTab or nofollow attributes exist, no migration needed
	if ( opensInNewTab === undefined && nofollow === undefined ) {
		return attributes;
	}

	let newRel = rel;

	// Add new tab rel if opensInNewTab was true
	if ( opensInNewTab && ! newRel.includes( NEW_TAB_REL ) ) {
		newRel = newRel ? `${ newRel } ${ NEW_TAB_REL }` : NEW_TAB_REL;
	}

	// Add nofollow rel if nofollow was true
	if ( nofollow && ! newRel.includes( NOFOLLOW_REL ) ) {
		newRel = newRel ? `${ newRel } ${ NOFOLLOW_REL }` : NOFOLLOW_REL;
	}

	// Clean up extra spaces
	newRel = newRel.trim().replace( /\s+/g, ' ' );

	return {
		...restAttributes,
		rel: newRel || undefined,
	};
};

// Version 2: Navigation link with opensInNewTab attribute (and potentially remaining nofollow)
const v2 = {
	attributes: {
		label: {
			type: 'string',
		},
		type: {
			type: 'string',
		},
		description: {
			type: 'string',
		},
		rel: {
			type: 'string',
		},
		id: {
			type: 'number',
		},
		opensInNewTab: {
			type: 'boolean',
			default: false,
		},
		url: {
			type: 'string',
		},
		title: {
			type: 'string',
		},
		kind: {
			type: 'string',
		},
		isTopLevelLink: {
			type: 'boolean',
		},
		nofollow: {
			type: 'boolean',
			default: false,
		},
	},
	isEligible( attributes ) {
		// This deprecation is eligible if the block has opensInNewTab attribute
		// (nofollow might still exist from blocks that haven't been migrated from v1)
		return attributes.opensInNewTab !== undefined;
	},
	migrate: migrateToRelAttribute,
	save() {
		// No save function needed since we're only migrating attributes
		// The current save function will handle the migrated attributes
		return null;
	},
};

// Version 1: Original deprecation for nofollow attribute only
const v1 = {
	attributes: {
		label: {
			type: 'string',
		},
		type: {
			type: 'string',
		},
		nofollow: {
			type: 'boolean',
		},
		description: {
			type: 'string',
		},
		id: {
			type: 'number',
		},
		opensInNewTab: {
			type: 'boolean',
			default: false,
		},
		url: {
			type: 'string',
		},
	},
	isEligible( attributes ) {
		return attributes.nofollow;
	},
	migrate( { nofollow, ...rest } ) {
		return {
			rel: nofollow ? 'nofollow' : '',
			...rest,
		};
	},
	save() {
		return <InnerBlocks.Content />;
	},
};

export default [ v2, v1 ];
