/**
 * WordPress dependencies
 */
import { store as coreStore } from '@wordpress/core-data';
import type { Action, Field } from '@wordpress/dataviews';
import { doAction } from '@wordpress/hooks';
import type { PostType } from '@wordpress/fields';
import {
	viewPost,
	viewPostRevisions,
	duplicatePost,
	duplicatePattern,
	reorderPage,
	exportPattern,
	permanentlyDeletePost,
	restorePost,
	trashPost,
	renamePost,
	resetPost,
	deletePost,
	duplicateTemplatePart,
	featuredImageField,
	dateField,
	parentField,
	passwordField,
	commentStatusField,
	slugField,
	statusField,
	authorField,
	titleField,
	templateField,
	templateTitleField,
	pageTitleField,
} from '@wordpress/fields';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';
import { unlock } from '../../lock-unlock';
import {
	NAVIGATION_POST_TYPE,
	PATTERN_POST_TYPE,
	TEMPLATE_PART_POST_TYPE,
	TEMPLATE_POST_TYPE,
} from '../../store/constants';

const DESIGN_POST_TYPES = [
	PATTERN_POST_TYPE,
	TEMPLATE_POST_TYPE,
	NAVIGATION_POST_TYPE,
	TEMPLATE_PART_POST_TYPE,
];

export function registerEntityAction< Item >(
	kind: string,
	name: string,
	config: Action< Item >
) {
	return {
		type: 'REGISTER_ENTITY_ACTION' as const,
		kind,
		name,
		config,
	};
}

export function unregisterEntityAction(
	kind: string,
	name: string,
	actionId: string
) {
	return {
		type: 'UNREGISTER_ENTITY_ACTION' as const,
		kind,
		name,
		actionId,
	};
}

export function registerEntityField< Item >(
	kind: string,
	name: string,
	config: Field< Item >
) {
	return {
		type: 'REGISTER_ENTITY_FIELD' as const,
		kind,
		name,
		config,
	};
}

export function unregisterEntityField(
	kind: string,
	name: string,
	fieldId: string
) {
	return {
		type: 'UNREGISTER_ENTITY_FIELD' as const,
		kind,
		name,
		fieldId,
	};
}

export function setIsReady( kind: string, name: string ) {
	return {
		type: 'SET_IS_READY' as const,
		kind,
		name,
	};
}

export const registerPostTypeSchema =
	( postType: string ) =>
	async ( { registry }: { registry: any } ) => {
		const isReady = unlock( registry.select( editorStore ) ).isEntityReady(
			'postType',
			postType
		);
		if ( isReady ) {
			return;
		}

		unlock( registry.dispatch( editorStore ) ).setIsReady(
			'postType',
			postType
		);

		const postTypeConfig = ( await registry
			.resolveSelect( coreStore )
			.getPostType( postType ) ) as PostType;

		const canCreate = await registry
			.resolveSelect( coreStore )
			.canUser( 'create', {
				kind: 'postType',
				name: postType,
			} );
		const currentTheme = await registry
			.resolveSelect( coreStore )
			.getCurrentTheme();

		const isDeisgnPostType = DESIGN_POST_TYPES.includes( postType );
		const actions = [
			postTypeConfig.viewable ? viewPost : undefined,
			!! postTypeConfig.supports?.revisions
				? viewPostRevisions
				: undefined,
			// @ts-ignore
			globalThis.IS_GUTENBERG_PLUGIN
				? ! isDeisgnPostType && canCreate && duplicatePost
				: undefined,
			postTypeConfig.slug === 'wp_template_part' &&
			canCreate &&
			currentTheme?.is_block_theme
				? duplicateTemplatePart
				: undefined,
			canCreate && postType === 'wp_block' ? duplicatePattern : undefined,
			postTypeConfig.supports?.title ? renamePost : undefined,
			postTypeConfig.supports?.[ 'page-attributes' ]
				? reorderPage
				: undefined,
			postType === 'wp_block' ? exportPattern : undefined,
			restorePost,
			resetPost,
			deletePost,
			trashPost,
			permanentlyDeletePost,
		].filter( Boolean );

		const fields = [
			postTypeConfig.supports?.thumbnail &&
				currentTheme?.theme_supports?.[ 'post-thumbnails' ] &&
				featuredImageField,
			! isDeisgnPostType &&
				postTypeConfig.supports?.title &&
				( postType === 'page' ? pageTitleField : titleField ),
			postType === TEMPLATE_POST_TYPE && templateTitleField,
			postTypeConfig.supports?.author && authorField,
			statusField,
			dateField,
			slugField,
			postTypeConfig.supports?.[ 'page-attributes' ] && parentField,
			postTypeConfig.supports?.comments && commentStatusField,
			templateField,
			! isDeisgnPostType && passwordField,
		].filter( Boolean );

		registry.batch( () => {
			actions.forEach( ( action ) => {
				unlock( registry.dispatch( editorStore ) ).registerEntityAction(
					'postType',
					postType,
					action
				);
			} );
			fields.forEach( ( field ) => {
				unlock( registry.dispatch( editorStore ) ).registerEntityField(
					'postType',
					postType,
					field
				);
			} );
		} );

		doAction( 'core.registerPostTypeSchema', postType );
	};
