/**
 * Internal dependencies
 */
import type { Field } from './types';

/**
 * Interface for field dependency information
 */
export interface FieldDependency {
	/** The field ID */
	id: string;
	/** Required entity properties for this field */
	entityFields: string[];
	/** Required _embed parameters for this field */
	embedFields?: string[];
	/** Whether this field requires additional data resolution */
	requiresResolution?: boolean;
}

/**
 * Maps DataViews field IDs to their required entity properties and REST API parameters.
 * This enables partial entity fetching for performance optimization.
 */
export const FIELD_DEPENDENCIES: Record<string, FieldDependency> = {
	// Basic post fields
	title: {
		id: 'title',
		entityFields: ['id', 'title'],
	},
	
	slug: {
		id: 'slug',
		entityFields: ['id', 'slug'],
	},
	
	date: {
		id: 'date',
		entityFields: ['id', 'date'],
	},
	
	modified: {
		id: 'modified',
		entityFields: ['id', 'modified'],
	},
	
	status: {
		id: 'status',
		entityFields: ['id', 'status'],
	},
	
	// Author field requires embedded author data
	author: {
		id: 'author',
		entityFields: ['id', 'author'],
		embedFields: ['author'],
		requiresResolution: true,
	},
	
	// Featured image field
	featured_media: {
		id: 'featured_media',
		entityFields: ['id', 'featured_media'],
		embedFields: ['wp:featuredmedia'],
	},
	
	// Content and excerpt fields
	content: {
		id: 'content',
		entityFields: ['id', 'content'],
	},
	
	excerpt: {
		id: 'excerpt',
		entityFields: ['id', 'excerpt'],
	},
	
	// Parent field for hierarchical post types
	parent: {
		id: 'parent',
		entityFields: ['id', 'parent'],
	},
	
	// Template field for posts
	template: {
		id: 'template',
		entityFields: ['id', 'template'],
	},
	
	// Comment status
	comment_status: {
		id: 'comment_status',
		entityFields: ['id', 'comment_status'],
	},
	
	// Password field
	password: {
		id: 'password',
		entityFields: ['id', 'password'],
	},
	
	// Permissions related fields
	permissions: {
		id: 'permissions',
		entityFields: ['id'],
		requiresResolution: true,
	},
};

/**
 * Analyzes an array of DataViews fields and returns the minimal set of entity properties
 * and REST API parameters needed to render those fields.
 * 
 * @param fields Array of DataViews field definitions
 * @return Object containing required entity fields and embed parameters
 */
export function analyzeFieldDependencies<T>( fields: Field<T>[] ): {
	entityFields: string[];
	embedFields: string[];
	requiresFullFetch: boolean;
} {
	const entityFields = new Set<string>(['id']); // Always include ID
	const embedFields = new Set<string>();
	let requiresFullFetch = false;
	
	for ( const field of fields ) {
		const dependency = FIELD_DEPENDENCIES[field.id];
		
		if ( ! dependency ) {
			// Unknown field - we need to fetch everything to be safe
			requiresFullFetch = true;
			continue;
		}
		
		// Add required entity fields
		dependency.entityFields.forEach( fieldName => entityFields.add( fieldName ) );
		
		// Add required embed fields
		if ( dependency.embedFields ) {
			dependency.embedFields.forEach( embed => embedFields.add( embed ) );
		}
		
		// If field requires special resolution, we might need full fetch
		if ( dependency.requiresResolution ) {
			// For now, we still optimize but note this field needs special handling
		}
	}
	
	return {
		entityFields: Array.from( entityFields ),
		embedFields: Array.from( embedFields ),
		requiresFullFetch,
	};
}

/**
 * Builds optimized query arguments for useEntityRecords based on field dependencies.
 * 
 * @param baseQueryArgs Base query arguments
 * @param fieldDependencies Result from analyzeFieldDependencies
 * @return Optimized query arguments with _fields and _embed parameters
 */
export function buildOptimizedQueryArgs( 
	baseQueryArgs: Record<string, any>,
	fieldDependencies: ReturnType<typeof analyzeFieldDependencies>
): Record<string, any> {
	const optimizedArgs = { ...baseQueryArgs };
	
	// Don't optimize if we need full fetch
	if ( fieldDependencies.requiresFullFetch ) {
		return optimizedArgs;
	}
	
	// Add _fields parameter to limit returned fields
	if ( fieldDependencies.entityFields.length > 0 ) {
		optimizedArgs._fields = fieldDependencies.entityFields.join( ',' );
	}
	
	// Add _embed parameter for embedded resources
	if ( fieldDependencies.embedFields.length > 0 ) {
		// Merge with existing _embed if present
		const existingEmbed = optimizedArgs._embed;
		const allEmbeds = existingEmbed 
			? [existingEmbed, ...fieldDependencies.embedFields]
			: fieldDependencies.embedFields;
		
		optimizedArgs._embed = allEmbeds.join( ',' );
	}
	
	return optimizedArgs;
}

/**
 * Hook for optimized entity records fetching based on field dependencies.
 * This is a drop-in replacement for useEntityRecords that automatically
 * optimizes queries based on the fields being displayed.
 */
export function useOptimizedEntityRecords<T>( 
	kind: string,
	name: string,
	queryArgs: Record<string, any>,
	fields: Field<T>[]
) {
	const fieldDependencies = analyzeFieldDependencies( fields );
	const optimizedQueryArgs = buildOptimizedQueryArgs( queryArgs, fieldDependencies );
	
	// For now, return the analysis - the actual hook implementation
	// will be in the next file
	return {
		fieldDependencies,
		optimizedQueryArgs,
	};
}
