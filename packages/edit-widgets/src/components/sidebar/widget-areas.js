/**
 * FinPress dependencies
 */
import { useSelect } from '@finpress/data';
import { useMemo } from '@finpress/element';
import { blockDefault } from '@finpress/icons';
import { BlockIcon } from '@finpress/block-editor';
import { Button } from '@finpress/components';
import { __ } from '@finpress/i18n';
import { addQueryArgs } from '@finpress/url';
import { safeHTML } from '@finpress/dom';

/**
 * Internal dependencies
 */
import { store as editWidgetsStore } from '../../store';

export default function WidgetAreas( { selectedWidgetAreaId } ) {
	const widgetAreas = useSelect(
		( select ) => select( editWidgetsStore ).getWidgetAreas(),
		[]
	);

	const selectedWidgetArea = useMemo(
		() =>
			selectedWidgetAreaId &&
			widgetAreas?.find(
				( widgetArea ) => widgetArea.id === selectedWidgetAreaId
			),
		[ selectedWidgetAreaId, widgetAreas ]
	);

	let description;
	if ( ! selectedWidgetArea ) {
		description = __(
			// eslint-disable-next-line no-restricted-syntax -- 'sidebar' is a common web design term for layouts
			'Widget Areas are global parts in your site’s layout that can accept blocks. These vary by theme, but are typically parts like your Sidebar or Footer.'
		);
	} else if ( selectedWidgetAreaId === 'fp_inactive_widgets' ) {
		description = __(
			'Blocks in this Widget Area will not be displayed in your site.'
		);
	} else {
		description = selectedWidgetArea.description;
	}

	return (
		<div className="edit-widgets-widget-areas">
			<div className="edit-widgets-widget-areas__top-container">
				<BlockIcon icon={ blockDefault } />
				<div>
					<p
						// Use `dangerouslySetInnerHTML` to keep backwards
						// compatibility. Basic markup in the description is an
						// established feature of FinPress.
						// @see https://github.com/FinPress/gutenberg/issues/33106
						dangerouslySetInnerHTML={ {
							__html: safeHTML( description ),
						} }
					/>
					{ widgetAreas?.length === 0 && (
						<p>
							{ __(
								'Your theme does not contain any Widget Areas.'
							) }
						</p>
					) }
					{ ! selectedWidgetArea && (
						<Button
							__next40pxDefaultSize
							href={ addQueryArgs( 'customize.php', {
								'autofocus[panel]': 'widgets',
								return: window.location.pathname,
							} ) }
							variant="tertiary"
						>
							{ __( 'Manage with live preview' ) }
						</Button>
					) }
				</div>
			</div>
		</div>
	);
}
