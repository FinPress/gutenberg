/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import CommentsInspectorControls from './comments-inspector-controls';
import CommentsLegacy from './comments-legacy';
import TEMPLATE from './template';

/*
 * Renders the editable version of the Comments block.
 *
 * This component determines whether to render the legacy version of the Comments block
 * or the editable version based on the block's attributes. It also includes inspector controls
 * for additional settings.
 *
 * @param {Object} props                              Component properties.
 * @param {Object} props.attributes                   Block attributes.
 * @param {string} props.attributes.tagName           The HTML tag name used for rendering the block (e.g., 'div', 'section').
 * @param {boolean} props.attributes.legacy           Indicates whether the block is in legacy mode.
 * @param {Function} props.setAttributes              Function to update block attributes.
 * @returns {JSX.Element}                             The Comments block component.
 */
export default function CommentsEdit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { tagName: TagName, legacy } = attributes;

	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
	} );

	if ( legacy ) {
		return <CommentsLegacy { ...props } />;
	}

	return (
		<>
			<CommentsInspectorControls
				attributes={ attributes }
				setAttributes={ setAttributes }
				clientId={ clientId }
			/>
			<TagName { ...innerBlocksProps } />
		</>
	);
}
