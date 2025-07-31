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

function TermTemplateInnerBlocks( { classList } ) {
	const innerBlocksProps = useInnerBlocksProps(
		{ className: clsx( 'wp-block-term', classList ) },
		{ template: TEMPLATE, __unstableDisableLayoutClassNames: true }
	);
	return <li { ...innerBlocksProps } />;
}

function TermTemplateBlockPreview( {
	blocks,
	blockContextId,
	classList,
	isHidden,
	setActiveBlockContextId,
	termName,
	termCount,
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
		>
			{ termName } { termCount }
		</li>
	);
}

const MemoizedTermTemplateBlockPreview = memo( TermTemplateBlockPreview );

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

export default function TermTemplateEdit( {
	clientId,
	context: {
		termQuery: {
			taxonomy,
			order,
			orderBy,
			hideEmpty,
			hierarchical,
			parent,
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
		taxonomy,
		queryArgs
	);

	// Filter to show only top-level terms if "Show only top-level terms" is enabled.
	const filteredTerms = useMemo( () => {
		if ( ! terms || parent !== 0 ) {
			return terms;
		}
		return terms.filter( ( term ) => ! term.parent );
	}, [ terms, parent ] );

	const { blocks } = useSelect(
		( select ) => ( {
			blocks: select( blockEditorStore ).getBlocks( clientId ),
		} ),
		[ clientId ]
	);

	const blockContexts = useMemo(
		() =>
			filteredTerms?.map( ( term ) => ( {
				taxonomy,
				termId: term.id,
				classList: `term-${ term.id }`,
			} ) ),
		[ filteredTerms, taxonomy ]
	);

	const blockProps = useBlockProps( {
		className: clsx( 'wp-block-term-template' ),
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
			taxonomy,
			termId: term.id,
			classList: `term-${ term.id }`,
		};

		// Get the term count for display in preview
		const termCount = term.count || 0;

		return (
			<BlockContextProvider key={ term.id } value={ blockContext }>
				{ term.id ===
				( activeBlockContextId || blockContexts[ 0 ]?.termId ) ? (
					<TermTemplateInnerBlocks
						classList={ blockContext.classList }
						term={ term }
					/>
				) : null }
				<MemoizedTermTemplateBlockPreview
					blocks={ blocks }
					blockContextId={ term.id }
					classList={ blockContext.classList }
					setActiveBlockContextId={ setActiveBlockContextId }
					isHidden={
						term.id ===
						( activeBlockContextId || blockContexts[ 0 ]?.termId )
					}
					termName={ term.name }
					termCount={ `(${ termCount })` }
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

		return blockContexts.map( ( blockContext ) => {
			const term = filteredTerms.find(
				( t ) => t.id === blockContext.termId
			);
			const termCount = term?.count || 0;

			return (
				<BlockContextProvider
					key={ blockContext.termId }
					value={ blockContext }
				>
					{ blockContext.termId ===
					( activeBlockContextId || blockContexts[ 0 ]?.termId ) ? (
						<TermTemplateInnerBlocks
							classList={ blockContext.classList }
							term={ term }
						/>
					) : null }
					<MemoizedTermTemplateBlockPreview
						blocks={ blocks }
						blockContextId={ blockContext.termId }
						classList={ blockContext.classList }
						setActiveBlockContextId={ setActiveBlockContextId }
						isHidden={
							blockContext.termId ===
							( activeBlockContextId ||
								blockContexts[ 0 ]?.termId )
						}
						termName={ term?.name }
						termCount={ `(${ termCount })` }
					/>
				</BlockContextProvider>
			);
		} );
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
