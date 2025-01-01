/**
 * External dependencies
 */
import { capitalCase, pascalCase } from 'change-case';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { RichTextData } from '@wordpress/rich-text';
import { parse } from '@wordpress/blocks';
import * as buf from 'lib0/buffer';
import * as math from 'lib0/math';
import * as fun from 'lib0/function';

/**
 * Internal dependencies
 */
import { getSyncProvider, Y } from './sync';

export const DEFAULT_ENTITY_KEY = 'id';
const POST_RAW_ATTRIBUTES = [ 'title', 'excerpt', 'content' ];

const queryYdocComment =
	/<!-- y:gutenberg version="(.*)" state="([a-zA-Z0-9+/]*={0,3})" new-content-clientid="(.*)" -->/;

// @todo refactor `applyChangesToDoc` implementations this to have less repetition (there are
// multiple similar implementations)

/**
 * Similar to `parse`, but only reads the Yjs document if available.
 * @param {string} postType
 * @param {string} content
 */
export function parseContentYdoc( postType, content ) {
	const res = queryYdocComment.exec( content );
	if ( res === null ) {
		return null;
	}
	const [ , yversion, ystate, _newclientid ] = res;
	if ( yversion !== '1' ) {
		throw new Error( 'Unexpected y:gutenberg version.' );
	}
	const newclientid = Number.parseInt( _newclientid );
	const blockContent =
		content.slice( 0, res.index ) +
		content.slice( res.index + res[ 0 ].length );
	const syncProvider = getSyncProvider();
	// Replay actions in a consistent manner, so that every client performs the same actions to
	// retrieve a certain document.
	// It is important that this is a fresh document - don't use the document from the sync package!
	const ydoc = new Y.Doc( { meta: new Map() } );
	/**
	 * @type {Set<string>}
	 */
	const knownUpdateGuids = new Set();
	ydoc.meta.set( 'knownRemoteUpdates', knownUpdateGuids );
	if ( ystate.length > 0 ) {
		Y.applyUpdateV2( ydoc, buf.fromBase64( ystate ) );
	}
	// Changing the Yjs clientid may lead to very weird bugs if done incorrectly.
	// Please handle the following code-portion with great care!
	const prevClientId = ydoc.clientID;
	ydoc.clientID = newclientid;
	const prevClock = ( ydoc.store.clients.get( newclientid ) || [
		{ id: { clock: 0 } },
	] )[ 0 ].id.clock;
	const blocks = parse( blockContent );
	syncProvider.postTypeConfigs[ postType ].applyChangesToDoc( ydoc, {
		blocks,
	} );
	ydoc.clientID = prevClientId;
	const newClock = ( ydoc.store.clients.get( newclientid ) ?? [
		{ id: { clock: 0 } },
	] )[ 0 ].id.clock;
	if ( prevClock !== newClock ) {
		// eslint-disable-next-line no-console
		console.info(
			'[Yjs Collab] Yjs document was updated to reflect changes to the HTML document.'
		);
	}
	return ydoc;
}

// @todo only sync what is necessary!
const filteredAttributes = new Set( [ 'content' ] );

/**
 * @param {Y.Doc} ydoc
 */
const defaultYdocTransformer = ( ydoc ) => {
	const json = ydoc.getMap( 'document' ).toJSON();
	if ( json.title?.raw ) {
		json.title = json.title.raw;
	}
	return json;
};

export const rootEntitiesConfig = [
	{
		label: __( 'Base' ),
		kind: 'root',
		name: '__unstableBase',
		baseURL: '/',
		baseURLParams: {
			// Please also change the preload path when changing this.
			// @see lib/compat/wordpress-6.8/preload.php
			_fields: [
				'description',
				'gmt_offset',
				'home',
				'name',
				'site_icon',
				'site_icon_url',
				'site_logo',
				'timezone_string',
				'default_template_part_areas',
				'default_template_types',
				'url',
			].join( ',' ),
		},
		// The entity doesn't support selecting multiple records.
		// The property is maintained for backward compatibility.
		plural: '__unstableBases',
		syncConfig: {
			fetch: async () => {
				return apiFetch( { path: '/' } );
			},
			applyChangesToDoc: ( doc, changes ) => {
				const content = changes.content?.raw || changes.content;
				const parsedYdoc =
					typeof content === 'string'
						? parseContentYdoc( 'root/base', content )
						: null; // Note: always use the same 'postType' as this object's config.syncObjectType
				if ( parsedYdoc !== null ) {
					// parse content which contains a ydoc, and apply it to the current ydoc. The rest of the attributes can be ignored.
					Y.transact(
						doc,
						() => {
							// apply remote changes
							Y.applyUpdate(
								doc,
								Y.encodeStateAsUpdate( parsedYdoc )
							);
						},
						'applyChangesToDoc',
						false
					);
				} else {
					// local changes happened. Apply the differences to the ydoc
					const document = doc.getMap( 'document' );
					Object.entries( changes ).forEach( ( [ key, value ] ) => {
						if (
							! filteredAttributes.has( key ) &&
							document.get( key ) !== value
						) {
							document.set( key, value );
						}
					} );
				}
			},
			fromCRDTDoc: defaultYdocTransformer,
		},
		syncObjectType: 'root/base',
		getSyncObjectId: () => 'index',
	},
	{
		label: __( 'Post Type' ),
		name: 'postType',
		kind: 'root',
		key: 'slug',
		baseURL: '/wp/v2/types',
		baseURLParams: { context: 'edit' },
		plural: 'postTypes',
		syncConfig: {
			fetch: async ( id ) => {
				return apiFetch( {
					path: `/wp/v2/types/${ id }?context=edit`,
				} );
			},
			applyChangesToDoc: ( doc, changes ) => {
				const content = changes.content?.raw || changes.content;
				const parsedYdoc =
					typeof content === 'string'
						? parseContentYdoc( 'root/postType', content )
						: null; // Note: always use the same 'postType' as this object's config.syncObjectType
				if ( parsedYdoc !== null ) {
					// parse content which contains a ydoc, and apply it to the current ydoc. The rest of the attributes can be ignored.
					Y.transact(
						doc,
						() => {
							// apply remote changes
							Y.applyUpdate(
								doc,
								Y.encodeStateAsUpdate( parsedYdoc )
							);
						},
						'applyChangesToDoc',
						false
					);
				} else {
					// local changes happened. Apply the differences to the ydoc
					const document = doc.getMap( 'document' );
					Object.entries( changes ).forEach( ( [ key, value ] ) => {
						if (
							! filteredAttributes.has( key ) &&
							document.get( key ) !== value
						) {
							document.set( key, value );
						}
					} );
				}
			},
			fromCRDTDoc: defaultYdocTransformer,
		},
		syncObjectType: 'root/postType',
		getSyncObjectId: ( id ) => id,
	},
	{
		name: 'media',
		kind: 'root',
		baseURL: '/wp/v2/media',
		baseURLParams: { context: 'edit' },
		plural: 'mediaItems',
		label: __( 'Media' ),
		rawAttributes: [ 'caption', 'title', 'description' ],
		supportsPagination: true,
	},
	{
		name: 'taxonomy',
		kind: 'root',
		key: 'slug',
		baseURL: '/wp/v2/taxonomies',
		baseURLParams: { context: 'edit' },
		plural: 'taxonomies',
		label: __( 'Taxonomy' ),
	},
	{
		name: 'sidebar',
		kind: 'root',
		baseURL: '/wp/v2/sidebars',
		baseURLParams: { context: 'edit' },
		plural: 'sidebars',
		transientEdits: { blocks: true },
		label: __( 'Widget areas' ),
	},
	{
		name: 'widget',
		kind: 'root',
		baseURL: '/wp/v2/widgets',
		baseURLParams: { context: 'edit' },
		plural: 'widgets',
		transientEdits: { blocks: true },
		label: __( 'Widgets' ),
	},
	{
		name: 'widgetType',
		kind: 'root',
		baseURL: '/wp/v2/widget-types',
		baseURLParams: { context: 'edit' },
		plural: 'widgetTypes',
		label: __( 'Widget types' ),
	},
	{
		label: __( 'User' ),
		name: 'user',
		kind: 'root',
		baseURL: '/wp/v2/users',
		baseURLParams: { context: 'edit' },
		plural: 'users',
	},
	{
		name: 'comment',
		kind: 'root',
		baseURL: '/wp/v2/comments',
		baseURLParams: { context: 'edit' },
		plural: 'comments',
		label: __( 'Comment' ),
	},
	{
		name: 'menu',
		kind: 'root',
		baseURL: '/wp/v2/menus',
		baseURLParams: { context: 'edit' },
		plural: 'menus',
		label: __( 'Menu' ),
	},
	{
		name: 'menuItem',
		kind: 'root',
		baseURL: '/wp/v2/menu-items',
		baseURLParams: { context: 'edit' },
		plural: 'menuItems',
		label: __( 'Menu Item' ),
		rawAttributes: [ 'title' ],
	},
	{
		name: 'menuLocation',
		kind: 'root',
		baseURL: '/wp/v2/menu-locations',
		baseURLParams: { context: 'edit' },
		plural: 'menuLocations',
		label: __( 'Menu Location' ),
		key: 'name',
	},
	{
		label: __( 'Global Styles' ),
		name: 'globalStyles',
		kind: 'root',
		baseURL: '/wp/v2/global-styles',
		baseURLParams: { context: 'edit' },
		plural: 'globalStylesVariations', // Should be different from name.
		getTitle: ( record ) => record?.title?.rendered || record?.title,
		getRevisionsUrl: ( parentId, revisionId ) =>
			`/wp/v2/global-styles/${ parentId }/revisions${
				revisionId ? '/' + revisionId : ''
			}`,
		supportsPagination: true,
	},
	{
		label: __( 'Themes' ),
		name: 'theme',
		kind: 'root',
		baseURL: '/wp/v2/themes',
		baseURLParams: { context: 'edit' },
		plural: 'themes',
		key: 'stylesheet',
	},
	{
		label: __( 'Plugins' ),
		name: 'plugin',
		kind: 'root',
		baseURL: '/wp/v2/plugins',
		baseURLParams: { context: 'edit' },
		plural: 'plugins',
		key: 'plugin',
	},
	{
		label: __( 'Status' ),
		name: 'status',
		kind: 'root',
		baseURL: '/wp/v2/statuses',
		baseURLParams: { context: 'edit' },
		plural: 'statuses',
		key: 'slug',
	},
];

export const additionalEntityConfigLoaders = [
	{ kind: 'postType', loadEntities: loadPostTypeEntities },
	{ kind: 'taxonomy', loadEntities: loadTaxonomyEntities },
	{
		kind: 'root',
		name: 'site',
		plural: 'sites',
		loadEntities: loadSiteEntity,
	},
];

/**
 * Returns a function to be used to retrieve extra edits to apply before persisting a post type.
 *
 * @param {Object} persistedRecord Already persisted Post
 * @param {Object} edits           Edits.
 * @return {Object} Updated edits.
 */
export const prePersistPostType = ( persistedRecord, edits ) => {
	const newEdits = {};

	if ( persistedRecord?.status === 'auto-draft' ) {
		// Saving an auto-draft should create a draft by default.
		if ( ! edits.status && ! newEdits.status ) {
			newEdits.status = 'draft';
		}

		// Fix the auto-draft default title.
		if (
			( ! edits.title || edits.title === 'Auto Draft' ) &&
			! newEdits.title &&
			( ! persistedRecord?.title ||
				persistedRecord?.title === 'Auto Draft' )
		) {
			newEdits.title = '';
		}
	}

	return newEdits;
};

const serialisableBlocksCache = new WeakMap();

function makeBlockAttributesSerializable( attributes ) {
	const newAttributes = { ...attributes };
	for ( const [ key, value ] of Object.entries( attributes ) ) {
		if ( value instanceof RichTextData ) {
			newAttributes[ key ] = value.valueOf();
		}
	}
	return newAttributes;
}

function makeBlocksSerializable( blocks ) {
	return blocks.map( ( block ) => {
		const { innerBlocks, attributes, ...rest } = block;
		delete rest.validationIssues;
		delete rest.originalContent;
		// delete rest.isValid
		return {
			...rest,
			attributes: makeBlockAttributesSerializable( attributes ),
			innerBlocks: makeBlocksSerializable( innerBlocks ),
		};
	} );
}

/**
 * Returns the list of post type entities.
 *
 * @return {Promise} Entities promise
 */
async function loadPostTypeEntities() {
	const postTypes = await apiFetch( {
		path: '/wp/v2/types?context=view',
	} );
	return Object.entries( postTypes ?? {} ).map( ( [ name, postType ] ) => {
		const isTemplate = [ 'wp_template', 'wp_template_part' ].includes(
			name
		);
		const namespace = postType?.rest_namespace ?? 'wp/v2';
		return {
			kind: 'postType',
			baseURL: `/${ namespace }/${ postType.rest_base }`,
			baseURLParams: { context: 'edit' },
			name,
			label: postType.name,
			transientEdits: {
				blocks: true,
				selection: true,
			},
			mergedEdits: { meta: true },
			rawAttributes: POST_RAW_ATTRIBUTES,
			getTitle: ( record ) =>
				record?.title?.rendered ||
				record?.title ||
				( isTemplate
					? capitalCase( record.slug ?? '' )
					: String( record.id ) ),
			__unstablePrePersist: isTemplate ? undefined : prePersistPostType,
			__unstable_rest_base: postType.rest_base,
			syncConfig: {
				/**
				 * @param {string}  id
				 * @param {boolean} autosave
				 * @return {Promise<string>} the post content
				 */
				fetch: async ( id, autosave ) => {
					if ( autosave === undefined ) {
						// eslint-disable-next-line no-console
						console.error( 'autosave should not be undefined' );
					} // @todo add proper typings
					if ( autosave ) {
						// Currently just exploiting autosave functionality.
						// @todo there should a a special WP API for this
						const [ post, autosaves ] = await Promise.all( [
							apiFetch( {
								path: `/${ namespace }/${ postType.rest_base }/${ id }?context=edit`,
							} ),
							apiFetch( {
								path: `/${ namespace }/${
									postType.rest_base
								}/${ id }${ '/autosaves?context=edit' }`,
							} ),
						] );
						if ( autosaves?.length > 0 ) {
							if ( autosaves.length > 1 ) {
								// eslint-disable-next-line no-console
								console.warn(
									'there were multiple autosaves, @todo should merge them.'
								);
							}
							post.content = autosaves[ 0 ].content;
							return post;
						}
					}
					return apiFetch( {
						path: `/${ namespace }/${ postType.rest_base }/${ id }?context=edit`,
					} );
				},
				/**
				 * @param {Y.Doc} doc
				 * @param {any}   changes
				 */
				applyChangesToDoc: ( doc, changes ) => {
					const content = changes.content?.raw || changes.content;
					const parsedYdoc =
						typeof content === 'string'
							? parseContentYdoc(
									'postType/' + postType.name,
									content
							  )
							: null; // Note: always use the same 'postType' as this object's config.syncObjectType
					if ( parsedYdoc !== null ) {
						// parse content which contains a ydoc, and apply it to the current ydoc. The rest of the attributes can be ignored.
						Y.transact(
							doc,
							() => {
								// apply remote changes
								Y.applyUpdate(
									doc,
									Y.encodeStateAsUpdate( parsedYdoc )
								);
							},
							'applyChangesToDoc',
							false
						);
					} else {
						// local changes happened. Apply the differences to the ydoc
						const document = doc.getMap( 'document' );
						Object.entries( changes ).forEach(
							( [ key, value ] ) => {
								if ( typeof value !== 'function' ) {
									if ( key === 'blocks' ) {
										// @todo actually diff the blocks instead of doing this
										if (
											! serialisableBlocksCache.has(
												value
											)
										) {
											serialisableBlocksCache.set(
												value,
												makeBlocksSerializable( value )
											);
										}
										const blocks =
											serialisableBlocksCache.get(
												value
											);
										// this is a rudimentary diff implementation similar to the y-prosemirror diffing
										// approach.
										if (
											! document.has( key ) ||
											document.get( key ) instanceof Array
										) {
											// @todo remove the array check
											document.set( key, new Y.Array() );
										}
										/**
										 * @type {Y.Array<Y.Map<any>>}
										 */
										const yblocks = document.get( key );
										const numOfCommonEntries = math.min(
											blocks.length,
											yblocks.length
										);
										let left = 0;
										let right = 0;

										/**
										 * @param {any}   block
										 * @param {Y.Map} yblock
										 */
										const blocksEqual = ( block, yblock ) =>
											// @todo improve this
											fun.equalityDeep(
												Object.assign( {}, block, {
													clientId: 'x',
												} ),
												Object.assign(
													{},
													yblock.toJSON(),
													{ clientId: 'x' }
												)
											);

										// skip equal blocks from left
										for (
											;
											left < numOfCommonEntries &&
											blocksEqual(
												blocks[ left ],
												yblocks.get( left )
											);
											left++
										) {
											/* nop */
										}
										// skip equal blocks from right
										for (
											;
											right < numOfCommonEntries - left &&
											blocksEqual(
												blocks[
													blocks.length - right - 1
												],
												yblocks.get(
													yblocks.length - right - 1
												)
											);
											right++
										) {
											/* nop */
										}
										const numOfUpdatesNeeded =
											numOfCommonEntries - left - right;
										const numOfInsertionsNeeded = math.max(
											0,
											blocks.length - yblocks.length
										);
										const numOfDeletionsNeeded = math.max(
											0,
											yblocks.length - blocks.length
										);
										doc.transact( () => {
											// updates
											for (
												let i = 0;
												i < numOfUpdatesNeeded;
												i++, left++
											) {
												const block = blocks[ left ];
												const yblock =
													yblocks.get( left );
												Object.entries( block ).forEach(
													( [ k, v ] ) => {
														if (
															! fun.equalityDeep(
																block[ k ],
																yblock.get( k )
															)
														) {
															yblock.set( k, v );
														}
													}
												);
												yblocks
													.toArray()
													.forEach( ( k ) => {
														if (
															! block.hasOwnProperty(
																k
															)
														) {
															yblock.delete( k );
														}
													} );
											}
											// inserts
											for (
												let i = 0;
												i < numOfInsertionsNeeded;
												i++, left++
											) {
												yblocks.insert( left, [
													new Y.Map(
														Object.entries(
															blocks[ left ]
														)
													),
												] );
											}
											// deletes
											yblocks.delete(
												left,
												numOfDeletionsNeeded
											);
										} );
									} else if (
										document.get( key ) !== value
									) {
										document.set( key, value );
									}
								}
							}
						);
					}
				},
				fromCRDTDoc: defaultYdocTransformer,
			},
			syncObjectType: 'postType/' + postType.name,
			getSyncObjectId: ( id ) => id,
			supportsPagination: true,
			getRevisionsUrl: ( parentId, revisionId ) =>
				`/${ namespace }/${
					postType.rest_base
				}/${ parentId }/revisions${
					revisionId ? '/' + revisionId : ''
				}`,
			revisionKey: isTemplate ? 'wp_id' : DEFAULT_ENTITY_KEY,
		};
	} );
}

/**
 * Returns the list of the taxonomies entities.
 *
 * @return {Promise} Entities promise
 */
async function loadTaxonomyEntities() {
	const taxonomies = await apiFetch( {
		path: '/wp/v2/taxonomies?context=view',
	} );
	return Object.entries( taxonomies ?? {} ).map( ( [ name, taxonomy ] ) => {
		const namespace = taxonomy?.rest_namespace ?? 'wp/v2';
		return {
			kind: 'taxonomy',
			baseURL: `/${ namespace }/${ taxonomy.rest_base }`,
			baseURLParams: { context: 'edit' },
			name,
			label: taxonomy.name,
		};
	} );
}

/**
 * Returns the Site entity.
 *
 * @return {Promise} Entity promise
 */
async function loadSiteEntity() {
	const entity = {
		label: __( 'Site' ),
		name: 'site',
		kind: 'root',
		baseURL: '/wp/v2/settings',
		syncConfig: {
			fetch: async () => {
				return apiFetch( { path: '/wp/v2/settings' } );
			},
			applyChangesToDoc: ( doc, changes ) => {
				const content = changes.content?.raw || changes.content;
				const parsedYdoc =
					typeof content === 'string'
						? parseContentYdoc( 'root/site', content )
						: null; // Note: always use the same 'postType' as this object's config.syncObjectType
				if ( parsedYdoc !== null ) {
					// parse content which contains a ydoc, and apply it to the current ydoc. The rest of the attributes can be ignored.
					Y.transact(
						doc,
						() => {
							// apply remote changes
							Y.applyUpdate(
								doc,
								Y.encodeStateAsUpdate( parsedYdoc )
							);
						},
						'applyChangesToDoc',
						false
					);
				} else {
					// local changes happened. Apply the differences to the ydoc
					const document = doc.getMap( 'document' );
					Object.entries( changes ).forEach( ( [ key, value ] ) => {
						if (
							! filteredAttributes.has( key ) &&
							document.get( key ) !== value
						) {
							document.set( key, value );
						}
					} );
				}
			},
			fromCRDTDoc: defaultYdocTransformer,
		},
		syncObjectType: 'root/site',
		getSyncObjectId: () => 'index',
		meta: {},
	};

	// this is a query that I could use
	const site = await apiFetch( {
		path: entity.baseURL,
		method: 'OPTIONS',
	} );

	const labels = {};
	Object.entries( site?.schema?.properties ?? {} ).forEach(
		( [ key, value ] ) => {
			// Ignore properties `title` and `type` keys.
			if ( typeof value === 'object' && value.title ) {
				labels[ key ] = value.title;
			}
		}
	);

	return [ { ...entity, meta: { labels } } ];
}

/**
 * Returns the entity's getter method name given its kind and name or plural name.
 *
 * @example
 * ```js
 * const nameSingular = getMethodName( 'root', 'theme', 'get' );
 * // nameSingular is getRootTheme
 *
 * const namePlural = getMethodName( 'root', 'themes', 'set' );
 * // namePlural is setRootThemes
 * ```
 *
 * @param {string} kind   Entity kind.
 * @param {string} name   Entity name or plural name.
 * @param {string} prefix Function prefix.
 *
 * @return {string} Method name
 */
export const getMethodName = ( kind, name, prefix = 'get' ) => {
	const kindPrefix = kind === 'root' ? '' : pascalCase( kind );
	const suffix = pascalCase( name );
	return `${ prefix }${ kindPrefix }${ suffix }`;
};
