/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	AlignmentControl,
	BlockControls,
	Warning,
	useBlockProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Placeholder from './placeholder';

/*
 * Renders the legacy version of the Comments block.
 *
 * This component serves as a placeholder for the Comments block, informing the user
 * that they are using the legacy version and providing an option to switch to an editable mode.
 *
 * @param {Object} props                              Component properties.
 * @param {Object} props.attributes                   Block attributes.
 * @param {string} [props.attributes.textAlign]       Text alignment for the block (e.g., 'left', 'center', 'right').
 * @param {Function} props.setAttributes              Function to update block attributes.
 * @param {Object} props.context                      Contextual properties.
 * @param {string} props.context.postType             The type of the post (e.g., 'post', 'page').
 * @param {string} props.context.postId               The ID of the current post.
 * @returns {JSX.Element}                             The legacy Comments block placeholder component.
 */
export default function CommentsLegacy( {
	attributes,
	setAttributes,
	context: { postType, postId },
} ) {
	const { textAlign } = attributes;

	const actions = [
		<Button
			__next40pxDefaultSize
			key="convert"
			onClick={ () => void setAttributes( { legacy: false } ) }
			variant="primary"
		>
			{ __( 'Switch to editable mode' ) }
		</Button>,
	];

	const blockProps = useBlockProps( {
		className: clsx( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>

			<div { ...blockProps }>
				<Warning actions={ actions }>
					{ __(
						'Comments block: You’re currently using the legacy version of the block. ' +
							'The following is just a placeholder - the final styling will likely look different. ' +
							'For a better representation and more customization options, ' +
							'switch the block to its editable mode.'
					) }
				</Warning>
				<Placeholder postId={ postId } postType={ postType } />
			</div>
		</>
	);
}
