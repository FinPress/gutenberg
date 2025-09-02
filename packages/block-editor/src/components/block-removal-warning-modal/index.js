/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	Modal,
	Button,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';
import { unlock } from '../../lock-unlock';

/**
 * A modal component that displays warning messages when attempting to remove critical blocks
 * from WordPress templates and patterns. Provides confirmation dialog and handling for safe
 * block removal with customizable rules.
 *
 * @see https://github.com/WordPress/gutenberg/tree/HEAD/packages/block-editor/src/components/block-removal-warning
 *
 * @example
 * ```jsx
 * import { BlockRemovalWarningModal } from '@wordpress/block-editor';
 *
 * function Example() {
 *     const rules = [{
 *         postTypes: ['wp_template'],
 *         callback(removedBlocks) {
 *             if (removedBlocks.some(block => block.name === 'core/post-content')) {
 *                 return 'Warning: Removing this block will affect template display.';
 *             }
 *         },
 *     }];
 *
 *     return <BlockRemovalWarningModal rules={rules} />;
 * }
 * ```
 *
 * @param {Object}   props       Component props.
 * @param {Object[]} props.rules Array of removal warning rules. Each rule should contain
 *                               postTypes array and a callback function.
 */
export function BlockRemovalWarningModal( { rules } ) {
	const { clientIds, selectPrevious, message } = useSelect( ( select ) =>
		unlock( select( blockEditorStore ) ).getRemovalPromptData()
	);

	const {
		clearBlockRemovalPrompt,
		setBlockRemovalRules,
		privateRemoveBlocks,
	} = unlock( useDispatch( blockEditorStore ) );

	// Load block removal rules, simultaneously signalling that the block
	// removal prompt is in place.
	useEffect( () => {
		setBlockRemovalRules( rules );
		return () => {
			setBlockRemovalRules();
		};
	}, [ rules, setBlockRemovalRules ] );

	if ( ! message ) {
		return;
	}

	const onConfirmRemoval = () => {
		privateRemoveBlocks( clientIds, selectPrevious, /* force */ true );
		clearBlockRemovalPrompt();
	};

	return (
		<Modal
			title={ __( 'Be careful!' ) }
			onRequestClose={ clearBlockRemovalPrompt }
			size="medium"
		>
			<p>{ message }</p>
			<HStack justify="right">
				<Button
					variant="tertiary"
					onClick={ clearBlockRemovalPrompt }
					__next40pxDefaultSize
				>
					{ __( 'Cancel' ) }
				</Button>
				<Button
					variant="primary"
					onClick={ onConfirmRemoval }
					__next40pxDefaultSize
				>
					{ __( 'Delete' ) }
				</Button>
			</HStack>
		</Modal>
	);
}
