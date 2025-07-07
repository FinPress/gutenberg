/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { memo, useMemo, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __, _x } from '@wordpress/i18n';
import {
	BlockControls,
	BlockContextProvider,
	__experimentalUseBlockPreview as useBlockPreview,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { Spinner, ToolbarGroup } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import { list, grid } from '@wordpress/icons';

const TEMPLATE = [
	[ 'core/term-name' ],
	[ 'core/term-count' ],
	[ 'core/term-description' ],
];

function TermsTemplateInnerBlocks( { classList } ) {
	const innerBlocksProps = useInnerBlocksProps(
		{ className: clsx( 'wp-block-term', classList ) },
		{ template: TEMPLATE, __unstableDisableLayoutClassNames: true }
	);
	return <li { ...innerBlocksProps } />;
}

function TermsTemplateBlockPreview( {
	blocks,
	blockContextId,
	classList,
	isHidden,
	setActiveBlockContextId,
} ) {
	const blockPreviewProps = useBlockPreview( {
		blocks,
		props: {
			className: clsx( 'wp-block-term', classList ),
		},
	} );

	const handleOnClick = () => {
		setActiveBlockContextId( blockContextId );
	};

	const style = {
		display: isHidden ? 'none' : undefined,
	};

	return (
		<li
			{ ...blockPreviewProps }
			tabIndex={ 0 }
			// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
			role="button"
			onClick={ handleOnClick }
			onKeyPress={ handleOnClick }
			style={ style }
		/>
	);
}

const MemoizedTermsTemplateBlockPreview = memo( TermsTemplateBlockPreview );

export default function TermsTemplateEdit( {
	setAttributes,
	clientId,
	context: {
		query: {
			perPage,
			offset = 0,
			taxonomy: taxonomySlug,
			order,
			orderBy,
			hideEmpty,
			hierarchical,
			parent,
			exclude,
			include,
			search,
		} = {},
	},
	attributes: { layout },
	__unstableLayoutClassNames,
} ) {
	const [ activeBlockContextId, setActiveBlockContextId ] = useState();

	const query = {
		per_page: perPage || 3,
		offset,
		order,
		orderby: orderBy,
		hide_empty: hideEmpty,
		hierarchical,
		parent,
		exclude,
		include,
		search,
		context: 'view',
	};

	const { records: terms, isResolving } = useEntityRecords(
		'taxonomy',
		taxonomySlug
	);

	const { blocks } = useSelect(
		( select ) => ( {
			blocks: select( blockEditorStore ).getBlocks( clientId ),
		} ),
		[ clientId ]
	);

	const layoutType = layout?.type || 'default';
	const columnCount = layout?.columnCount || 3;

	const blockContexts = useMemo(
		() =>
			terms?.map( ( term ) => ( {
				termType: taxonomySlug,
				termId: term.id,
				classList: `term-${ term.id }`,
			} ) ),
		[ terms, taxonomySlug ]
	);

	const blockProps = useBlockProps( {
		className: clsx( __unstableLayoutClassNames, {
			[ `columns-${ columnCount }` ]:
				layoutType === 'grid' && columnCount,
		} ),
	} );

	if ( isResolving ) {
		return (
			<p { ...blockProps }>
				<Spinner />
			</p>
		);
	}

	if ( ! terms?.length ) {
		return <p { ...blockProps }> { __( 'No terms found.' ) }</p>;
	}

	const setDisplayLayout = ( newDisplayLayout ) =>
		setAttributes( {
			layout: { ...layout, ...newDisplayLayout },
		} );

	const displayLayoutControls = [
		{
			icon: list,
			title: _x( 'List view', 'Terms template block display setting' ),
			onClick: () => setDisplayLayout( { type: 'default' } ),
			isActive: layoutType === 'default' || layoutType === 'constrained',
		},
		{
			icon: grid,
			title: _x( 'Grid view', 'Terms template block display setting' ),
			onClick: () =>
				setDisplayLayout( {
					type: 'grid',
					columnCount,
				} ),
			isActive: layoutType === 'grid',
		},
	];

	return (
		<>
			<BlockControls>
				<ToolbarGroup controls={ displayLayoutControls } />
			</BlockControls>

			<ul { ...blockProps }>
				{ blockContexts &&
					blockContexts.map( ( blockContext ) => (
						<BlockContextProvider
							key={ blockContext.termId }
							value={ blockContext }
						>
							{ blockContext.termId ===
							( activeBlockContextId ||
								blockContexts[ 0 ]?.termId ) ? (
								<TermsTemplateInnerBlocks
									classList={ blockContext.classList }
								/>
							) : null }
							<MemoizedTermsTemplateBlockPreview
								blocks={ blocks }
								blockContextId={ blockContext.termId }
								classList={ blockContext.classList }
								setActiveBlockContextId={
									setActiveBlockContextId
								}
								isHidden={
									blockContext.termId ===
									( activeBlockContextId ||
										blockContexts[ 0 ]?.termId )
								}
							/>
						</BlockContextProvider>
					) ) }
			</ul>
		</>
	);
}
