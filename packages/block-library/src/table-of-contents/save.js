/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import TableOfContentsList from './list';
import { linearToNestedHeadingList } from './utils';

export default function save( { attributes: { headings = [], title } } ) {
	if ( headings.length === 0 ) {
		return null;
	}
	return (
		<nav { ...useBlockProps.save() }>
			{ title && (
				<h2 className="wp-block-table-of-contents__title">{ title }</h2>
			) }
			<ol>
				<TableOfContentsList
					nestedHeadingList={ linearToNestedHeadingList( headings ) }
				/>
			</ol>
		</nav>
	);
}
