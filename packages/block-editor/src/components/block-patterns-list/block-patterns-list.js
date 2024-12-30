/**
 * WordPress dependencies
 */
import { DataViews, filterSortAndPaginate } from '@wordpress/dataviews';
import { useState, forwardRef, useMemo, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useEvent } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import {
	myPatternsCategory,
	INSERTER_PATTERN_TYPES,
} from '../inserter/block-patterns-tab/utils';
import {
	titleField,
	previewField,
	sourceField,
	syncStatusField,
} from './fields';

const LAYOUT_GRID = 'grid';
const EMPTY_ARRAY = [];
const defaultLayouts = {
	[ LAYOUT_GRID ]: {
		layout: {
			previewSize: 1,
			badgeFields: [ 'sync-status' ],
		},
	},
};
const DEFAULT_VIEW = {
	type: LAYOUT_GRID,
	search: '',
	page: 1,
	perPage: 20,
	titleField: 'title',
	mediaField: 'preview',
	fields: [],
	filters: [],
	...defaultLayouts[ LAYOUT_GRID ],
};

function filterBySource( pattern, sourceFilter ) {
	const isDirectoryPattern =
		pattern.source === 'core' ||
		pattern.source?.startsWith( 'pattern-directory' );
	// If the directory source is selected, filter out user created patterns
	// and those bundled with the theme.
	if ( sourceFilter === INSERTER_PATTERN_TYPES.directory ) {
		return isDirectoryPattern;
	}
	const isUserPattern = pattern.name.startsWith( 'core/block' );
	// If theme source selected, filter out user created patterns and those from
	// the core patterns directory.
	if ( sourceFilter === INSERTER_PATTERN_TYPES.theme ) {
		return ! ( isUserPattern || isDirectoryPattern );
	}
	// If user source selected, filter out theme patterns.
	if ( sourceFilter === INSERTER_PATTERN_TYPES.user ) {
		return pattern.type === INSERTER_PATTERN_TYPES.user;
	}
	return false;
}

function BlockPatternsList(
	{
		isDraggable,
		blockPatterns,
		onHover,
		onClickPattern,
		orientation,
		label = __( 'Block patterns' ),
		category,
		showTitle,
	},
	ref
) {
	const [ view, setView ] = useState( {
		...DEFAULT_VIEW,
		showTitle,
	} );

	const fields = useMemo( () => {
		const _fields = [ titleField, previewField, syncStatusField ];
		if ( category !== myPatternsCategory.name ) {
			_fields.push( sourceField );
		}
		return _fields;
	}, [ category ] );
	// const previousCategoryId = usePrevious( categoryId );
	// const previousPostType = usePrevious( postType );
	// const [ activeCompositeId, setActiveCompositeId ] = useState( undefined );
	// const [ activePattern, setActivePattern ] = useState( null ); // State to track active pattern

	// useEffect( () => {
	// 	// Reset the active composite item whenever the available patterns change,
	// 	// to make sure that Composite widget can receive focus correctly when its
	// 	// composite items change. The first composite item will receive focus.
	// 	const firstCompositeItemId = blockPatterns[ 0 ]?.name;
	// 	setActiveCompositeId( firstCompositeItemId );
	// }, [ blockPatterns ] );

	const handleClickPattern = useEvent( ( pattern, blocks ) => {
		// setActivePattern( pattern.name );
		onClickPattern( pattern, blocks );
	} );

	const { data, paginationInfo } = useMemo( () => {
		// `source` field has custom filtering logic.
		let _patterns = [ ...blockPatterns ];
		const sourceFilterIndex = view.filters?.findIndex(
			( { field, value } ) => field === 'source' && !! value
		);
		const hasSourceFilter = sourceFilterIndex !== -1;
		if ( hasSourceFilter ) {
			_patterns = _patterns.filter( ( _pattern ) =>
				filterBySource(
					_pattern,
					view.filters[ sourceFilterIndex ].value
				)
			);
		}
		const _view = { ...view, filters: [ ...view.filters ] };
		if ( hasSourceFilter ) {
			_view.filters.splice( sourceFilterIndex, 1 );
		}
		return filterSortAndPaginate( _patterns, _view, fields );
	}, [ blockPatterns, view, fields ] );
	const augmentedData = useMemo( () => {
		return data?.map( ( item ) => ( {
			...item,
			isDraggable,
			onHover,
			onClick: handleClickPattern,
			selectedCategory: category,
		} ) );
	}, [ data, isDraggable, onHover, handleClickPattern, category ] );
	return (
		<DataViews
			key={ category }
			paginationInfo={ paginationInfo }
			fields={ fields }
			actions={ [] }
			data={ augmentedData || EMPTY_ARRAY }
			getItemId={ ( item ) => item.name }
			isLoading={ false }
			// isItemClickable={ () => true }
			// onClickItem={ ( item ) => {
			// 	// handleClickPattern
			// } }
			view={ view }
			onChangeView={ setView }
			defaultLayouts={ defaultLayouts }
			className="block-editor-block-patterns-list-v2"
		/>
	);
}

export default forwardRef( BlockPatternsList );
