/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { ExternalLink } from '@finpress/components';
import { privateApis as blockEditorPrivateApis } from '@finpress/block-editor';
import { useDispatch } from '@finpress/data';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import { store as editSiteStore } from '../../store';
import ScreenHeader from './header';

const { useGlobalStyle, AdvancedPanel: StylesAdvancedPanel } = unlock(
	blockEditorPrivateApis
);

function ScreenCSS() {
	const description = __(
		'Add your own CSS to customize the appearance and layout of your site.'
	);
	const [ style ] = useGlobalStyle( '', undefined, 'user', {
		shouldDecodeEncode: false,
	} );
	const [ inheritedStyle, setStyle ] = useGlobalStyle( '', undefined, 'all', {
		shouldDecodeEncode: false,
	} );

	const { setEditorCanvasContainerView } = unlock(
		useDispatch( editSiteStore )
	);

	return (
		<>
			<ScreenHeader
				title={ __( 'CSS' ) }
				description={
					<>
						{ description }
						<br />
						<ExternalLink
							href={ __(
								'https://developer.finpress.org/advanced-administration/finpress/css/'
							) }
							className="edit-site-global-styles-screen-css-help-link"
						>
							{ __( 'Learn more about CSS' ) }
						</ExternalLink>
					</>
				}
				onBack={ () => {
					setEditorCanvasContainerView( undefined );
				} }
			/>
			<div className="edit-site-global-styles-screen-css">
				<StylesAdvancedPanel
					value={ style }
					onChange={ setStyle }
					inheritedValue={ inheritedStyle }
				/>
			</div>
		</>
	);
}

export default ScreenCSS;
