/**
 * WordPress dependencies
 */
import { useEntityBlockEditor, store as coreStore } from '@wordpress/core-data';
import {
	InnerBlocks,
	useInnerBlocksProps,
	useSettings,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

function useRenderAppender( hasInnerBlocks ) {
	// Always allow appending blocks to template parts
	if ( ! hasInnerBlocks ) {
		return InnerBlocks.ButtonBlockAppender;
	}
}

function useLayout( layout ) {
	const themeSupportsLayout = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings()?.supportsLayout;
	}, [] );
	const [ defaultLayout ] = useSettings( 'layout' );
	if ( themeSupportsLayout ) {
		return layout?.inherit ? defaultLayout || {} : layout;
	}
}

function EditableTemplatePartInnerBlocks( {
	postId: id,
	hasInnerBlocks,
	layout,
	tagName: TagName,
	blockProps,
} ) {
	const [ blocks, onInput, onChange ] = useEntityBlockEditor(
		'postType',
		'wp_template_part',
		{ id }
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		value: blocks,
		onInput,
		onChange,
		renderAppender: useRenderAppender( hasInnerBlocks ),
		layout: useLayout( layout ),
	} );

	return <TagName { ...innerBlocksProps } />;
}

export default function TemplatePartInnerBlocks( {
	postId: id,
	hasInnerBlocks,
	layout,
	tagName: TagName,
	blockProps,
} ) {
	const { canViewTemplatePart } = useSelect(
		( select ) => {
			return {
				canViewTemplatePart: !! select( coreStore ).canUser( 'read', {
					kind: 'postType',
					name: 'wp_template_part',
					id,
				} ),
			};
		},
		[ id ]
	);

	if ( ! canViewTemplatePart ) {
		return null;
	}

	// Always use the editable component
	const TemplatePartInnerBlocksComponent = EditableTemplatePartInnerBlocks;

	return (
		<TemplatePartInnerBlocksComponent
			postId={ id }
			hasInnerBlocks={ hasInnerBlocks }
			layout={ layout }
			tagName={ TagName }
			blockProps={ blockProps }
		/>
	);
}
