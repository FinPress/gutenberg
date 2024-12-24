/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useState, useRef } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { Icon, plus } from '@wordpress/icons';
import { Button } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { LinkUI } from './link-ui';
import { updateAttributes } from './update-attributes';

export default function NavigationLinkAppender( { rootClientId } ) {
	const { insertBlock } = useDispatch( blockEditorStore );
	const [ isLinkOpen, setIsLinkOpen ] = useState( false );
	const [ popoverAnchor, setPopoverAnchor ] = useState( null );
	const linkUIref = useRef();

	const createNewLink = ( attributes ) => {
		const block = createBlock( 'core/navigation-link', attributes );

		insertBlock( block, undefined, rootClientId );
	};

	return (
		<>
			<Button
				__next40pxDefaultSize
				ref={ setPopoverAnchor }
				className="block-editor-button-block-appender"
				onClick={ () => setIsLinkOpen( ( state ) => ! state ) }
				aria-haspopup
				aria-expanded={ isLinkOpen }
				label="Add block"
				showTooltip
			>
				<Icon icon={ plus } />
			</Button>
			{ isLinkOpen && (
				<LinkUI
					ref={ linkUIref }
					clientId={ rootClientId }
					link={ {
						url: undefined,
						label: undefined,
						id: undefined,
						kind: undefined,
						type: undefined,
						opensInNewTab: false,
					} }
					onClose={ () => {
						setIsLinkOpen( false );
					} }
					onChange={ ( updatedValue ) => {
						setIsLinkOpen( false );
						updateAttributes( updatedValue, createNewLink );
					} }
					anchor={ popoverAnchor }
				/>
			) }
		</>
	);
}
