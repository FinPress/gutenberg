/**
 * WordPress dependencies
 */
import {
	ToolbarGroup,
	ToolbarButton,
	Dropdown,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PatternSelection, { useBlockPatterns } from './pattern-selection';

/*
 * QueryToolbar component renders a toolbar for selecting and changing design patterns.
 *
 * @param {Object} props                     Component props.
 * @param {string} props.clientId            The client ID of the block.
 * @param {Object} props.attributes          The block attributes.
 * @return {JSX.Element|null}                The rendered toolbar or null if no patterns are available.
 */
export default function QueryToolbar( { clientId, attributes } ) {
	const hasPatterns = useBlockPatterns( clientId, attributes ).length;
	if ( ! hasPatterns ) {
		return null;
	}

	return (
		<ToolbarGroup className="wp-block-template-part__block-control-group">
			<DropdownContentWrapper>
				<Dropdown
					contentClassName="block-editor-block-settings-menu__popover"
					focusOnMount="firstElement"
					expandOnMobile
					renderToggle={ ( { isOpen, onToggle } ) => (
						<ToolbarButton
							aria-haspopup="true"
							aria-expanded={ isOpen }
							onClick={ onToggle }
						>
							{ __( 'Change design' ) }
						</ToolbarButton>
					) }
					renderContent={ () => (
						<PatternSelection
							clientId={ clientId }
							attributes={ attributes }
							showSearch={ false }
							showTitlesAsTooltip
						/>
					) }
				/>
			</DropdownContentWrapper>
		</ToolbarGroup>
	);
}
