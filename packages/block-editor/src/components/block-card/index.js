/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import deprecated from '@wordpress/deprecated';
import {
	Button,
	__experimentalText as Text,
	__experimentalVStack as VStack,
	privateApis as componentsPrivateApis,
} from '@wordpress/components';
import { chevronLeft, chevronRight } from '@wordpress/icons';
import { __, _x, isRTL } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import BlockIcon from '../block-icon';
import { store as blockEditorStore } from '../../store';
import { unlock } from '../../lock-unlock';

const { Badge } = unlock( componentsPrivateApis );

function BlockCard( { title, icon, description, blockType, className, name } ) {
	if ( blockType ) {
		deprecated( '`blockType` property in `BlockCard component`', {
			since: '5.7',
			alternative: '`title, icon and description` properties',
		} );
		( { title, icon, description } = blockType );
	}

	const { parentNavBlockClientId, isUsingBindings } = useSelect(
		( select ) => {
			const {
				getSelectedBlockClientId,
				getSelectedBlockClientIds,
				getBlockParentsByBlockName,
				getBlockAttributes,
			} = select( blockEditorStore );

			const _selectedBlockClientId = getSelectedBlockClientId();
			const _selectedBlockClientIds = getSelectedBlockClientIds();

			return {
				parentNavBlockClientId: getBlockParentsByBlockName(
					_selectedBlockClientId,
					'core/navigation',
					true
				)[ 0 ],
				isUsingBindings: _selectedBlockClientIds.every(
					( clientId ) =>
						!! getBlockAttributes( clientId )?.metadata?.bindings
				),
			};
		},
		[]
	);

	const { selectBlock } = useDispatch( blockEditorStore );
	const hasCustomName = !! name?.length;

	return (
		<div className={ clsx( 'block-editor-block-card', className ) }>
			{ parentNavBlockClientId && ( // This is only used by the Navigation block for now. It's not ideal having Navigation block specific code here.
				<Button
					onClick={ () => selectBlock( parentNavBlockClientId ) }
					label={ __( 'Go to parent Navigation block' ) }
					style={
						// TODO: This style override is also used in ToolsPanelHeader.
						// It should be supported out-of-the-box by Button.
						{ minWidth: 24, padding: 0 }
					}
					icon={ isRTL() ? chevronRight : chevronLeft }
					size="small"
				/>
			) }
			<BlockIcon icon={ icon } showColors />
			<VStack spacing={ hasCustomName || isUsingBindings ? 2 : 1 }>
				<h2 className="block-editor-block-card__title">
					<span className="block-editor-block-card__name">
						{ hasCustomName ? name : title }
					</span>
					{ hasCustomName && <Badge>{ title }</Badge> }
					{ isUsingBindings && (
						<Badge>
							{ _x(
								'Connected',
								'block connected to a bound source'
							) }
						</Badge>
					) }
				</h2>
				{ description && (
					<Text
						as="p"
						className="block-editor-block-card__description"
					>
						{ description }
					</Text>
				) }
			</VStack>
		</div>
	);
}

export default BlockCard;
