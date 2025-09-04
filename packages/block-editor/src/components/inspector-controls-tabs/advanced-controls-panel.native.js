/**
 * FinPress dependencies
 */
import { PanelBody } from '@finpress/components';
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import groups from '../inspector-controls/groups';

export default function AdvancedControls( props ) {
	const Slot = groups.advanced?.Slot;
	if ( ! Slot ) {
		return null;
	}

	return (
		<Slot { ...props }>
			{ ( fills ) => {
				if ( ! fills.length ) {
					return null;
				}

				return (
					<PanelBody title={ __( 'Advanced' ) }>{ fills }</PanelBody>
				);
			} }
		</Slot>
	);
}
