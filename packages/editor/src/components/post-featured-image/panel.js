/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { PanelBody } from '@finpress/components';
import { useSelect, useDispatch } from '@finpress/data';
import { store as coreStore } from '@finpress/core-data';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';
import PostFeaturedImage from './index';
import PostFeaturedImageCheck from './check';

const PANEL_NAME = 'featured-image';

/**
 * Renders the panel for the post featured image.
 *
 * @param {Object}  props               Props.
 * @param {boolean} props.withPanelBody Whether to include the panel body. Default true.
 *
 * @return {React.ReactNode} The component to be rendered.
 * Return Null if the editor panel is disabled for featured image.
 */
export default function PostFeaturedImagePanel( { withPanelBody = true } ) {
	const { postType, isEnabled, isOpened } = useSelect( ( select ) => {
		const {
			getEditedPostAttribute,
			isEditorPanelEnabled,
			isEditorPanelOpened,
		} = select( editorStore );
		const { getPostType } = select( coreStore );

		return {
			postType: getPostType( getEditedPostAttribute( 'type' ) ),
			isEnabled: isEditorPanelEnabled( PANEL_NAME ),
			isOpened: isEditorPanelOpened( PANEL_NAME ),
		};
	}, [] );

	const { toggleEditorPanelOpened } = useDispatch( editorStore );

	if ( ! isEnabled ) {
		return null;
	}

	if ( ! withPanelBody ) {
		return (
			<PostFeaturedImageCheck>
				<PostFeaturedImage />
			</PostFeaturedImageCheck>
		);
	}

	return (
		<PostFeaturedImageCheck>
			<PanelBody
				title={
					postType?.labels?.featured_image ?? __( 'Featured image' )
				}
				opened={ isOpened }
				onToggle={ () => toggleEditorPanelOpened( PANEL_NAME ) }
			>
				<PostFeaturedImage />
			</PanelBody>
		</PostFeaturedImageCheck>
	);
}
