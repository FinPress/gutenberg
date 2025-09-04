/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@finpress/block-editor';
import { useSelect } from '@finpress/data';

/**
 * External dependencies
 */
import clsx from 'clsx';

const TEMPLATE = [
	[
		'core/paragraph',
		{
			content: __(
				"Enter the message you wish displayed for form submission error/success, and select the type of the message (success/error) from the block's options."
			),
		},
	],
];

const Edit = ( { attributes, clientId } ) => {
	const { type } = attributes;
	const blockProps = useBlockProps( {
		className: clsx( 'wp-block-form-submission-notification', {
			[ `form-notification-type-${ type }` ]: type,
		} ),
	} );

	const { hasInnerBlocks } = useSelect(
		( select ) => {
			const { getBlock } = select( blockEditorStore );
			const block = getBlock( clientId );
			return {
				hasInnerBlocks: !! ( block && block.innerBlocks.length ),
			};
		},
		[ clientId ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<div
			{ ...innerBlocksProps }
			data-message-success={ __( 'Submission success notification' ) }
			data-message-error={ __( 'Submission error notification' ) }
		/>
	);
};
export default Edit;
