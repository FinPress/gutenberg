/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { memo, useMemo, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
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

const TEMPLATE = [ [ 'core/term-name' ], [ 'core/term-count' ] ];

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

/**
 * Builds a hierarchical tree structure from flat terms array.
 *
 * @param {Array} terms Array of term objects.
 * @return {Array} Tree structure with parent/child relationships.
 */
function buildTermsTree( terms ) {
	const termsById = {};
	const rootTerms = [];

	terms.forEach( ( term ) => {
		termsById[ term.id ] = {
			term,
			children: [],
		};
	} );

	terms.forEach( ( term ) => {
		if ( term.parent && termsById[ term.parent ] ) {
			termsById[ term.parent ].children.push( termsById[ term.id ] );
		} else {
			rootTerms.push( termsById[ term.id ] );
		}
	} );

	return rootTerms;
}

/**
 * Renders a single term node and its children recursively.
 *
 * @param {Object}   termNode   Term node with term object and children.
 * @param {Function} renderTerm Function to render a single term.
 * @return {JSX.Element} Rendered term node.
 */
function renderTermNode( termNode, renderTerm ) {
	const children =
		termNode.children.length > 0 ? (
			<ul>
				{ termNode.children.map( ( childNode ) =>
					renderTermNode( childNode, renderTerm )
				) }
			</ul>
		) : null;

	return (
		<>
			{ renderTerm( termNode.term ) }
			{ children }
		</>
	);
}

export default function TermsTemplateEdit( {
	clientId,
	context: {
		query: {
			taxonomy: taxonomySlug,
			order,
			orderBy,
			hideEmpty,
			hierarchical,
			showOnlyTopLevel,
		} = {},
	},
} ) {
	const [ activeBlockContextId, setActiveBlockContextId ] = useState();

	const queryArgs = {
		order,
		orderby: orderBy,
		hide_empty: hideEmpty,
	};

	const { records: terms, isResolving } = useEntityRecords(
		'taxonomy',
		taxonomySlug,
		queryArgs
	);

	// Filter to show only top-level terms if showOnlyTopLevel is enabled.
	const filteredTerms = useMemo( () => {
		if ( ! terms || ! showOnlyTopLevel ) {
			return terms;
		}
		return terms.filter( ( term ) => ! term.parent );
	}, [ terms, showOnlyTopLevel ] );

	const { blocks } = useSelect(
		( select ) => ( {
			blocks: select( blockEditorStore ).getBlocks( clientId ),
		} ),
		[ clientId ]
	);

	const blockContexts = useMemo(
		() =>
			filteredTerms?.map( ( term ) => ( {
				termType: taxonomySlug,
				termId: term.id,
				classList: `term-${ term.id }`,
			} ) ),
		[ filteredTerms, taxonomySlug ]
	);

	const blockProps = useBlockProps( {
		className: clsx( 'wp-block-terms-template' ),
	} );

	if ( isResolving ) {
		return (
			<p { ...blockProps }>
				<Spinner />
			</p>
		);
	}

	if ( ! filteredTerms?.length ) {
		return <p { ...blockProps }> { __( 'No terms found.' ) }</p>;
	}

	const renderTerm = ( term ) => {
		const blockContext = {
			termType: taxonomySlug,
			termId: term.id,
			classList: `term-${ term.id }`,
		};

		return (
			<BlockContextProvider key={ term.id } value={ blockContext }>
				{ term.id ===
				( activeBlockContextId || blockContexts[ 0 ]?.termId ) ? (
					<TermsTemplateInnerBlocks
						classList={ blockContext.classList }
					/>
				) : null }
				<MemoizedTermsTemplateBlockPreview
					blocks={ blocks }
					blockContextId={ term.id }
					classList={ blockContext.classList }
					setActiveBlockContextId={ setActiveBlockContextId }
					isHidden={
						term.id ===
						( activeBlockContextId || blockContexts[ 0 ]?.termId )
					}
				/>
			</BlockContextProvider>
		);
	};

	const renderTerms = () => {
		if ( hierarchical ) {
			const termsTree = buildTermsTree( filteredTerms );
			return termsTree.map( ( termNode ) =>
				renderTermNode( termNode, renderTerm )
			);
		}

		return blockContexts.map( ( blockContext ) => (
			<BlockContextProvider
				key={ blockContext.termId }
				value={ blockContext }
			>
				{ blockContext.termId ===
				( activeBlockContextId || blockContexts[ 0 ]?.termId ) ? (
					<TermsTemplateInnerBlocks
						classList={ blockContext.classList }
					/>
				) : null }
				<MemoizedTermsTemplateBlockPreview
					blocks={ blocks }
					blockContextId={ blockContext.termId }
					classList={ blockContext.classList }
					setActiveBlockContextId={ setActiveBlockContextId }
					isHidden={
						blockContext.termId ===
						( activeBlockContextId || blockContexts[ 0 ]?.termId )
					}
				/>
			</BlockContextProvider>
		) );
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup />
			</BlockControls>

			<div { ...blockProps }>
				<ul>{ renderTerms() }</ul>
			</div>
		</>
	);
}
