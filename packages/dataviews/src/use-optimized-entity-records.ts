/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { useEntityRecords } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import type { Field } from './types';
import { analyzeFieldDependencies, buildOptimizedQueryArgs } from './field-dependencies';

/**
 * Hook for optimized entity records fetching based on field dependencies.
 * This is a drop-in replacement for useEntityRecords that automatically
 * optimizes queries based on the fields being displayed.
 * 
 * @param kind The entity kind (e.g., 'postType', 'root')
 * @param name The entity name (e.g., 'post', 'page')
 * @param queryArgs Base query arguments
 * @param fields Array of DataViews field definitions
 * @param options Additional options
 * @returns Same interface as useEntityRecords but with optimized queries
 */
export function useOptimizedEntityRecords<T>( 
	kind: string,
	name: string,
	queryArgs: Record<string, any> = {},
	fields: Field<T>[] = [],
	options: {
		enabled?: boolean;
		fallbackToFullFetch?: boolean;
	} = {}
) {
	const { enabled = true, fallbackToFullFetch = true } = options;
	
	// Analyze field dependencies to determine what data we need
	const fieldDependencies = useMemo( () => {
		if ( ! enabled || fields.length === 0 ) {
			return null;
		}
		return analyzeFieldDependencies( fields );
	}, [ enabled, fields ] );
	
	// Build optimized query arguments
	const optimizedQueryArgs = useMemo( () => {
		if ( ! fieldDependencies ) {
			return queryArgs;
		}
		
		// If we need full fetch or fallback is disabled, use original args
		if ( fieldDependencies.requiresFullFetch && ! fallbackToFullFetch ) {
			return queryArgs;
		}
		
		return buildOptimizedQueryArgs( queryArgs, fieldDependencies );
	}, [ queryArgs, fieldDependencies, fallbackToFullFetch ] );
	
	// Use the standard useEntityRecords hook with optimized arguments
	const result = useEntityRecords( kind, name, optimizedQueryArgs );
	
	// Add debug information in development
	if ( process.env.NODE_ENV === 'development' && fieldDependencies ) {
		const isOptimized = ! fieldDependencies.requiresFullFetch;
		const originalFieldCount = Object.keys( queryArgs ).length;
		const optimizedFieldCount = fieldDependencies.entityFields.length;
		
		// Use console.info instead of console.debug for better linting compatibility
		// eslint-disable-next-line no-console
		console.info( 'DataViews Field Optimization:', {
			kind,
			name,
			isOptimized,
			requestedFields: fields.map( f => f.id ),
			entityFields: fieldDependencies.entityFields,
			embedFields: fieldDependencies.embedFields,
			fieldReduction: isOptimized ? `${originalFieldCount} → ${optimizedFieldCount}` : 'none',
			queryArgs: optimizedQueryArgs,
		} );
	}
	
	return {
		...result,
		// Add metadata about the optimization
		_optimizationMeta: fieldDependencies ? {
			isOptimized: ! fieldDependencies.requiresFullFetch,
			requestedFields: fieldDependencies.entityFields,
			embedFields: fieldDependencies.embedFields,
		} : null,
	};
}

/**
 * Enhanced version of useEntityRecordsWithPermissions that includes field optimization.
 * This hook maintains the same interface as the original but adds performance optimizations
 * based on field dependencies.
 */
export function useOptimizedEntityRecordsWithPermissions<T>(
	kind: string,
	name: string,
	queryArgs: Record<string, any> = {},
	fields: Field<T>[] = [],
	options: {
		enabled?: boolean;
		fallbackToFullFetch?: boolean;
	} = {}
) {
	// For now, we'll use the basic optimized hook
	// In a full implementation, we'd also need to handle permissions checking
	const result = useOptimizedEntityRecords( kind, name, queryArgs, fields, options );
	
	// TODO: Add permissions checking logic here
	// This would involve checking user capabilities and filtering results accordingly
	
	return result;
}

/**
 * Utility hook to get performance metrics for field optimization.
 * Useful for monitoring and debugging the effectiveness of the optimization.
 */
export function useFieldOptimizationMetrics( 
	entityRecordsResult: ReturnType<typeof useOptimizedEntityRecords>
) {
	return useMemo( () => {
		const meta = entityRecordsResult._optimizationMeta;
		if ( ! meta ) {
			return null;
		}
		
		const estimatedBandwidthSaving = meta.isOptimized 
			? Math.round( ( 1 - ( meta.requestedFields.length / 20 ) ) * 100 ) // Assume ~20 fields in full fetch
			: 0;
			
		return {
			isOptimized: meta.isOptimized,
			requestedFieldCount: meta.requestedFields.length,
			embedFieldCount: meta.embedFields.length,
			estimatedBandwidthSaving: `${estimatedBandwidthSaving}%`,
			optimizationScore: meta.isOptimized ? 'good' : 'needs-improvement',
		};
	}, [ entityRecordsResult._optimizationMeta ] );
}