/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { readTextFile } from './file';

interface PostType {
	rest_base: string;
	[ key: string ]: any;
}

interface ParsedContent {
	__file: string;
	title: string;
	content: string;
	syncStatus?: string;
	[ key: string ]: any;
}

interface ReusableBlockMeta {
	wp_pattern_sync_status?: string;
}

interface ReusableBlockData {
	title: string;
	content: string;
	status: string;
	meta?: ReusableBlockMeta;
}

interface ReusableBlock {
	id: number;
	title: {
		raw: string;
		rendered: string;
	};
	content: {
		raw: string;
		rendered: string;
	};
	status: string;
	[ key: string ]: any;
}

/**
 * Import a reusable block from a JSON file.
 *
 * @param file - File to import
 * @return Promise returning the imported reusable block
 */
async function importReusableBlock( file: File ): Promise< ReusableBlock > {
	const fileContent = await readTextFile( file );
	let parsedContent: ParsedContent;

	try {
		parsedContent = JSON.parse( fileContent ) as ParsedContent;
	} catch ( e ) {
		throw new Error( 'Invalid JSON file' );
	}

	if (
		parsedContent.__file !== 'wp_block' ||
		! parsedContent.title ||
		! parsedContent.content ||
		typeof parsedContent.title !== 'string' ||
		typeof parsedContent.content !== 'string' ||
		( parsedContent.syncStatus &&
			typeof parsedContent.syncStatus !== 'string' )
	) {
		throw new Error( 'Invalid pattern JSON file' );
	}

	const postType = await apiFetch< PostType >( {
		path: `/wp/v2/types/wp_block`,
	} );

	const reusableBlock = await apiFetch< ReusableBlock >( {
		path: `/wp/v2/${ postType.rest_base }`,
		data: {
			title: parsedContent.title,
			content: parsedContent.content,
			status: 'publish',
			meta:
				parsedContent.syncStatus === 'unsynced'
					? { wp_pattern_sync_status: parsedContent.syncStatus }
					: undefined,
		} as ReusableBlockData,
		method: 'POST',
	} );

	return reusableBlock;
}

export default importReusableBlock;
