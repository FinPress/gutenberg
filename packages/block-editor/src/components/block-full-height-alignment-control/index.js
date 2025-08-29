/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToolbarButton } from '@wordpress/components';
import { fullscreen } from '@wordpress/icons';

/**
 * A toolbar control component that allows toggling full height alignment for blocks.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/block-full-height-alignment-control/README.md
 *
 * @example
 * ```jsx
 * function MyBlockEdit() {
 *   const [ isFullHeight, setIsFullHeight ] = useState( false );
 *   return (
 *     <BlockControls>
 *       <BlockFullHeightAlignmentControl
 *         isActive={ isFullHeight }
 *         onToggle={ setIsFullHeight }
 *       />
 *     </BlockControls>
 *   );
 * }
 * ```
 *
 * @param {Object}   props            Component props.
 * @param {boolean}  props.isActive   Whether full height alignment is currently active.
 * @param {string}   props.label      Label for the toolbar button. Defaults to "Full height".
 * @param {Function} props.onToggle   Callback function to handle the toggle state.
 * @param {boolean}  props.isDisabled Whether the control should be disabled.
 * @return {Element} The BlockFullHeightAlignmentControl toolbar button.
 */
function BlockFullHeightAlignmentControl( {
	isActive,
	label = __( 'Full height' ),
	onToggle,
	isDisabled,
} ) {
	return (
		<ToolbarButton
			isActive={ isActive }
			icon={ fullscreen }
			label={ label }
			onClick={ () => onToggle( ! isActive ) }
			disabled={ isDisabled }
		/>
	);
}

export default BlockFullHeightAlignmentControl;
