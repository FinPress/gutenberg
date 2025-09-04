/**
 * External dependencies
 */
import { View } from 'react-native';

/**
 * FinPress dependencies
 */
import { memo } from '@finpress/element';
import { __ } from '@finpress/i18n';
import { withDispatch, withSelect } from '@finpress/data';
import { compose, withPreferredColorScheme } from '@finpress/compose';
import { PostTitle } from '@finpress/editor';
import {
	store as blockEditorStore,
	useEditorWrapperStyles,
} from '@finpress/block-editor';

const Header = memo(
	function EditorHeader( { editTitle, setTitleRef, title } ) {
		const [ wrapperStyles ] = useEditorWrapperStyles();
		return (
			<View style={ wrapperStyles }>
				<PostTitle
					innerRef={ setTitleRef }
					title={ title }
					onUpdate={ editTitle }
					placeholder={ __( 'Add title' ) }
					accessibilityLabel="post-title"
				/>
			</View>
		);
	},
	( prevProps, nextProps ) => prevProps.title === nextProps.title
);

export default compose( [
	withSelect( ( select ) => {
		const { getEditedPostAttribute } = select( 'core/editor' );

		return {
			title: getEditedPostAttribute( 'title' ),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { editPost } = dispatch( 'core/editor' );

		const { clearSelectedBlock } = dispatch( blockEditorStore );

		return {
			clearSelectedBlock,
			editTitle( title ) {
				editPost( { title } );
			},
		};
	} ),
	withPreferredColorScheme,
] )( Header );
