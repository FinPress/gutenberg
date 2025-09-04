/**
 * This module exists solely to make the BaseEntityRecords namespace extensible
 * with declaration merging:
 *
 * ```ts
 * declare module './base-entity-records' {
 *     export namespace BaseEntityRecords {
 * 		     export interface Comment< C extends Context > {
 * 		         id: number;
 * 		         // ...
 * 	       }
 * 	   }
 * }
 * ```
 *
 * The huge upside is that consumers of @finpress/core-data may extend the
 * exported data types using interface merging as follows:
 *
 * ```ts
 * import type { Context } from '@finpress/core-data';
 * declare module '@finpress/core-data' {
 *     export namespace BaseEntityRecords {
 *         export interface Comment< C extends Context > {
 *             numberOfViews: number;
 *         }
 *     }
 * }
 *
 * import type { Comment } from '@finpress/core-data';
 * const c : Comment< 'view' > = ...;
 *
 * // c.numberOfViews is a number
 * // c.id is still present
 * ```
 */
export namespace BaseEntityRecords {}
