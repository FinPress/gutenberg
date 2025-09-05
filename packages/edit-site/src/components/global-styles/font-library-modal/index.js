/**
 * FinPress dependencies
 */
import { __, _x } from '@finpress/i18n';
import {
	Modal,
	privateApis as componentsPrivateApis,
} from '@finpress/components';
import { store as coreStore } from '@finpress/core-data';
import { useSelect } from '@finpress/data';
import { useContext } from '@finpress/element';

/**
 * Internal dependencies
 */
import InstalledFonts from './installed-fonts';
import FontCollection from './font-collection';
import UploadFonts from './upload-fonts';
import { FontLibraryContext } from './context';
import { unlock } from '../../../lock-unlock';

const { Tabs } = unlock( componentsPrivateApis );

const DEFAULT_TAB = {
	id: 'installed-fonts',
	title: _x( 'Library', 'Font library' ),
};

const UPLOAD_TAB = {
	id: 'upload-fonts',
	title: _x( 'Upload', 'noun' ),
};

const tabsFromCollections = ( collections ) =>
	collections.map( ( { slug, name } ) => ( {
		id: slug,
		title:
			collections.length === 1 && slug === 'google-fonts'
				? __( 'Install Fonts' )
				: name,
	} ) );

function FontLibraryModal( {
	onRequestClose,
	defaultTabId = 'installed-fonts',
} ) {
	const { collections } = useContext( FontLibraryContext );
	const canUserCreate = useSelect( ( select ) => {
		return select( coreStore ).canUser( 'create', {
			kind: 'postType',
			name: 'fp_font_family',
		} );
	}, [] );

	const tabs = [ DEFAULT_TAB ];

	if ( canUserCreate ) {
		tabs.push( UPLOAD_TAB );
		tabs.push( ...tabsFromCollections( collections || [] ) );
	}

	return (
		<Modal
			title={ __( 'Fonts' ) }
			onRequestClose={ onRequestClose }
			isFullScreen
			className="font-library-modal"
		>
			<Tabs defaultTabId={ defaultTabId }>
				<div className="font-library-modal__tablist-container">
					<Tabs.TabList>
						{ tabs.map( ( { id, title } ) => (
							<Tabs.Tab key={ id } tabId={ id }>
								{ title }
							</Tabs.Tab>
						) ) }
					</Tabs.TabList>
				</div>
				{ tabs.map( ( { id } ) => {
					let contents;
					switch ( id ) {
						case 'upload-fonts':
							contents = <UploadFonts />;
							break;
						case 'installed-fonts':
							contents = <InstalledFonts />;
							break;
						default:
							contents = <FontCollection slug={ id } />;
					}
					return (
						<Tabs.TabPanel
							key={ id }
							tabId={ id }
							focusable={ false }
						>
							{ contents }
						</Tabs.TabPanel>
					);
				} ) }
			</Tabs>
		</Modal>
	);
}

export default FontLibraryModal;
