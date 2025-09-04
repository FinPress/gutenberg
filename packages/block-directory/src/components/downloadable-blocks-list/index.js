/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { Composite } from '@finpress/components';
import { getBlockType } from '@finpress/blocks';
import { useDispatch } from '@finpress/data';

/**
 * Internal dependencies
 */
import DownloadableBlockListItem from '../downloadable-block-list-item';
import { store as blockDirectoryStore } from '../../store';

const noop = () => {};

function DownloadableBlocksList( { items, onHover = noop, onSelect } ) {
	const { installBlockType } = useDispatch( blockDirectoryStore );

	if ( ! items.length ) {
		return null;
	}

	return (
		<Composite
			role="listbox"
			className="block-directory-downloadable-blocks-list"
			aria-label={ __( 'Blocks available for install' ) }
		>
			{ items.map( ( item ) => {
				return (
					<DownloadableBlockListItem
						key={ item.id }
						onClick={ () => {
							// Check if the block is registered (`getBlockType`
							// will return an object). If so, insert the block.
							// This prevents installing existing plugins.
							if ( getBlockType( item.name ) ) {
								onSelect( item );
							} else {
								installBlockType( item ).then( ( success ) => {
									if ( success ) {
										onSelect( item );
									}
								} );
							}
							onHover( null );
						} }
						onHover={ onHover }
						item={ item }
					/>
				);
			} ) }
		</Composite>
	);
}

export default DownloadableBlocksList;
