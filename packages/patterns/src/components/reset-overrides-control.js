/**
 * FinPress dependencies
 */
import {
	store as blockEditorStore,
	__unstableBlockToolbarLastItem as BlockToolbarLastItem,
} from '@finpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@finpress/components';
import { useRegistry, useSelect } from '@finpress/data';
import { __ } from '@finpress/i18n';

const CONTENT = 'content';

export default function ResetOverridesControl( props ) {
	const name = props.attributes.metadata?.name;
	const registry = useRegistry();
	const isOverridden = useSelect(
		( select ) => {
			if ( ! name ) {
				return;
			}

			const { getBlockAttributes, getBlockParentsByBlockName } =
				select( blockEditorStore );
			const [ patternClientId ] = getBlockParentsByBlockName(
				props.clientId,
				'core/block',
				true
			);

			if ( ! patternClientId ) {
				return;
			}

			const overrides = getBlockAttributes( patternClientId )[ CONTENT ];

			if ( ! overrides ) {
				return;
			}

			return overrides.hasOwnProperty( name );
		},
		[ props.clientId, name ]
	);

	function onClick() {
		const { getBlockAttributes, getBlockParentsByBlockName } =
			registry.select( blockEditorStore );
		const [ patternClientId ] = getBlockParentsByBlockName(
			props.clientId,
			'core/block',
			true
		);

		if ( ! patternClientId ) {
			return;
		}

		const overrides = getBlockAttributes( patternClientId )[ CONTENT ];

		if ( ! overrides.hasOwnProperty( name ) ) {
			return;
		}

		const { updateBlockAttributes, __unstableMarkLastChangeAsPersistent } =
			registry.dispatch( blockEditorStore );
		__unstableMarkLastChangeAsPersistent();

		let newOverrides = { ...overrides };
		delete newOverrides[ name ];

		if ( ! Object.keys( newOverrides ).length ) {
			newOverrides = undefined;
		}

		updateBlockAttributes( patternClientId, {
			[ CONTENT ]: newOverrides,
		} );
	}

	return (
		<BlockToolbarLastItem>
			<ToolbarGroup>
				<ToolbarButton onClick={ onClick } disabled={ ! isOverridden }>
					{ __( 'Reset' ) }
				</ToolbarButton>
			</ToolbarGroup>
		</BlockToolbarLastItem>
	);
}
