/**
 * Internal dependencies
 */
import type { EntityRecordsWithPermissionsResolution } from './use-entity-records';

/**
 * Type for the `useEntityRecordsWithPermissions` private API function.
 *
 * This type represents the function signature for `useEntityRecordsWithPermissions`,
 * which resolves entity records with their associated permissions included.
 * It can be used to properly type the function when accessing it through the unlock mechanism.
 *
 * @example
 * ```ts
 * import { privateApis as coreDataPrivateApis } from '@wordpress/core-data';
 * import type { UseEntityRecordsWithPermissionsType } from '@wordpress/core-data';
 *
 * const { useEntityRecordsWithPermissions } = unlock< {
 *   useEntityRecordsWithPermissions: UseEntityRecordsWithPermissionsType;
 * } >( coreDataPrivateApis );
 * ```
 */
export type UseEntityRecordsWithPermissionsType = < RecordType >(
	kind: string,
	name: string,
	queryArgs?: Record< string, unknown >,
	options?: { enabled?: boolean }
) => EntityRecordsWithPermissionsResolution< RecordType >;

export {
	default as useEntityRecord,
	__experimentalUseEntityRecord,
} from './use-entity-record';
export {
	default as useEntityRecords,
	__experimentalUseEntityRecords,
} from './use-entity-records';
export {
	default as useResourcePermissions,
	__experimentalUseResourcePermissions,
} from './use-resource-permissions';
export { default as useEntityBlockEditor } from './use-entity-block-editor';
export { default as useEntityId } from './use-entity-id';
export { default as useEntityProp } from './use-entity-prop';
