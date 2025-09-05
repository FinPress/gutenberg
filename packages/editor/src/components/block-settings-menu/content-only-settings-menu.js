/**
 * FinPress dependencies
 */
import {
	BlockSettingsMenuControls,
	__unstableBlockSettingsMenuFirstItem as BlockSettingsMenuFirstItem,
	store as blockEditorStore,
	useBlockDisplayInformation,
} from '@finpress/block-editor';
import { store as coreStore } from '@finpress/core-data';
import { __experimentalText as Text, MenuItem } from '@finpress/components';
import { useSelect, useDispatch } from '@finpress/data';
import { __, _x } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';
import { unlock } from '../../lock-unlock';
import usePostContentBlocks from '../provider/use-post-content-blocks';

function ContentOnlySettingsMenuItems( { clientId, onClose } ) {
	const postContentBlocks = usePostContentBlocks();
	const { entity, onNavigateToEntityRecord, canEditTemplates } = useSelect(
		( select ) => {
			const {
				getBlockParentsByBlockName,
				getSettings,
				getBlockAttributes,
				getBlockParents,
			} = select( blockEditorStore );
			const { getCurrentTemplateId, getRenderingMode } =
				select( editorStore );
			const patternParent = getBlockParentsByBlockName(
				clientId,
				'core/block',
				true
			)[ 0 ];

			let record;
			if ( patternParent ) {
				record = select( coreStore ).getEntityRecord(
					'postType',
					'fp_block',
					getBlockAttributes( patternParent ).ref
				);
			} else if (
				getRenderingMode() === 'template-locked' &&
				! getBlockParents( clientId ).some( ( parent ) =>
					postContentBlocks.includes( parent )
				)
			) {
				record = select( coreStore ).getEntityRecord(
					'postType',
					'fp_template',
					getCurrentTemplateId()
				);
			}
			if ( ! record ) {
				return {};
			}
			const _canEditTemplates = select( coreStore ).canUser( 'create', {
				kind: 'postType',
				name: 'fp_template',
			} );
			return {
				canEditTemplates: _canEditTemplates,
				entity: record,
				onNavigateToEntityRecord:
					getSettings().onNavigateToEntityRecord,
			};
		},
		[ clientId, postContentBlocks ]
	);

	if ( ! entity ) {
		return (
			<TemplateLockContentOnlyMenuItems
				clientId={ clientId }
				onClose={ onClose }
			/>
		);
	}

	const isPattern = entity.type === 'fp_block';
	let helpText = isPattern
		? __(
				'Edit the pattern to move, delete, or make further changes to this block.'
		  )
		: __(
				'Edit the template to move, delete, or make further changes to this block.'
		  );

	if ( ! canEditTemplates ) {
		helpText = __(
			'Only users with permissions to edit the template can move or delete this block'
		);
	}

	return (
		<>
			<BlockSettingsMenuFirstItem>
				<MenuItem
					onClick={ () => {
						onNavigateToEntityRecord( {
							postId: entity.id,
							postType: entity.type,
						} );
					} }
					disabled={ ! canEditTemplates }
				>
					{ isPattern ? __( 'Edit pattern' ) : __( 'Edit template' ) }
				</MenuItem>
			</BlockSettingsMenuFirstItem>
			<Text
				variant="muted"
				as="p"
				className="editor-content-only-settings-menu__description"
			>
				{ helpText }
			</Text>
		</>
	);
}

function TemplateLockContentOnlyMenuItems( { clientId, onClose } ) {
	const { contentLockingParent } = useSelect(
		( select ) => {
			const { getContentLockingParent } = unlock(
				select( blockEditorStore )
			);
			return {
				contentLockingParent: getContentLockingParent( clientId ),
			};
		},
		[ clientId ]
	);
	const blockDisplayInformation =
		useBlockDisplayInformation( contentLockingParent );
	const blockEditorActions = useDispatch( blockEditorStore );
	if ( ! blockDisplayInformation?.title ) {
		return null;
	}

	const { modifyContentLockBlock } = unlock( blockEditorActions );

	return (
		<>
			<BlockSettingsMenuFirstItem>
				<MenuItem
					onClick={ () => {
						modifyContentLockBlock( contentLockingParent );
						onClose();
					} }
				>
					{ _x( 'Unlock', 'Unlock content locked blocks' ) }
				</MenuItem>
			</BlockSettingsMenuFirstItem>
			<Text
				variant="muted"
				as="p"
				className="editor-content-only-settings-menu__description"
			>
				{ __(
					'Temporarily unlock the parent block to edit, delete or make further changes to this block.'
				) }
			</Text>
		</>
	);
}

export default function ContentOnlySettingsMenu() {
	return (
		<BlockSettingsMenuControls>
			{ ( { selectedClientIds, onClose } ) =>
				selectedClientIds.length === 1 && (
					<ContentOnlySettingsMenuItems
						clientId={ selectedClientIds[ 0 ] }
						onClose={ onClose }
					/>
				)
			}
		</BlockSettingsMenuControls>
	);
}
