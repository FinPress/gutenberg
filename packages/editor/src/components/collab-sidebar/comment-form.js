/**
 * WordPress dependencies
 */
import { useState, useRef, useEffect } from '@wordpress/element';
import {
	__experimentalHStack as HStack,
	Button,
	TextareaControl,
} from '@wordpress/components';
import { _x, __ } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { sanitizeCommentString } from './utils';

/**
 * EditComment component.
 *
 * @param {Object}   props                  - The component props.
 * @param {Function} props.onSubmit         - The function to call when updating the comment.
 * @param {Function} props.onCancel         - The function to call when canceling the comment update.
 * @param {Object}   props.thread           - The comment thread object.
 * @param {string}   props.submitButtonText - The text to display on the submit button.
 * @param {boolean}  props.shouldFocus      - Whether to focus the textarea when the component is rendered.
 * @return {React.ReactNode} The CommentForm component.
 */
function CommentForm( {
	onSubmit,
	onCancel,
	thread,
	submitButtonText,
	shouldFocus = false,
} ) {
	const [ inputComment, setInputComment ] = useState(
		thread?.content?.raw ?? ''
	);

	const textareaRef = useRef( null );
	const instanceId = useInstanceId( CommentForm );
	const textareaId = `comment-textarea-${ instanceId }`;

	useEffect( () => {
		if ( shouldFocus && textareaRef.current ) {
			// Focus the textarea when shouldFocus is true
			const textareaElement = textareaRef.current;
			// Use requestAnimationFrame to ensure the component is rendered
			if ( textareaElement ) {
				textareaElement.focus();
			}
		}
	}, [ shouldFocus ] );

	return (
		<>
			<TextareaControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				value={ inputComment ?? '' }
				onChange={ setInputComment }
				label={ __( 'Comment' ) }
				hideLabelFromVision
				id={ textareaId }
				ref={ textareaRef }
			/>
			<HStack alignment="left" spacing="3" justify="flex-start">
				<Button
					__next40pxDefaultSize
					accessibleWhenDisabled
					variant="primary"
					onClick={ () => {
						onSubmit( inputComment );
						setInputComment( '' );
					} }
					disabled={
						0 === sanitizeCommentString( inputComment ).length
					}
					text={ submitButtonText }
				/>
				<Button
					__next40pxDefaultSize
					variant="tertiary"
					onClick={ onCancel }
					text={ _x( 'Cancel', 'Cancel comment button' ) }
				/>
			</HStack>
		</>
	);
}

export default CommentForm;
